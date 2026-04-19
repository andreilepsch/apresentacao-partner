import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Pool } from 'pg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// =====================================================
// DATABASE (Postgres do Coolify - rede interna)
// =====================================================
const DB_URL = process.env.DATABASE_URL || 
  'postgres://postgres:V98G2CqrT5HndRxyAOypXjQus1neX4ImUEH5LsdT8FgCb1fGYqujzvQQdxiKe7jP@y4o8owo04cc0w4sgw4o488w8:5432/postgres';

const pool = new Pool({ connectionString: DB_URL, ssl: false });

const query = (text, params) => pool.query(text, params);

// =====================================================
// R2 / CLOUDFLARE STORAGE
// =====================================================
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'autoridade-investimentos-apresentacao-partner';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 
  `https://pub-aa64382a056926eafbd86d095b1a3932.r2.dev/${R2_BUCKET}`;

const r2 = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID || 'aa64382a056926eafbd86d095b1a3932'}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'a1de0af9da82bbb44f3c8ceb106753ef',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '97891459f27d71a21c91f70ed32bbdf18a0efeabe4dbefbc5906dd18fb9554f4',
  },
});

// =====================================================
// HELPER: Verificar autenticação via Clerk JWT
// O clerk_user_id vem no header 'x-clerk-user-id' 
// (setado pelo frontend após verificação Clerk)
// =====================================================
function getClerkUserId(req) {
  return req.headers['x-clerk-user-id'] || null;
}

function requireAuth(req, res, next) {
  const userId = getClerkUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Não autenticado. Header x-clerk-user-id obrigatório.' });
  }
  req.clerkUserId = userId;
  next();
}

async function requireAdmin(req, res, next) {
  const userId = getClerkUserId(req);
  if (!userId) return res.status(401).json({ error: 'Não autenticado' });
  
  const result = await query(
    `SELECT role FROM apresentacao_partner.user_roles WHERE clerk_user_id = $1`,
    [userId]
  );
  
  if (!result.rows[0] || result.rows[0].role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  req.clerkUserId = userId;
  next();
}

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// =====================================================
// AUTH / USER ENDPOINTS
// =====================================================

// Registrar/sincronizar usuário via Clerk (chamado no login)
app.post('/api/auth/sync', requireAuth, async (req, res) => {
  const { email, fullName } = req.body;
  const clerkUserId = req.clerkUserId;

  try {
    // Upsert profile
    await query(
      `INSERT INTO apresentacao_partner.profiles (clerk_user_id, email, full_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (clerk_user_id) DO UPDATE SET 
         email = EXCLUDED.email,
         full_name = EXCLUDED.full_name,
         updated_at = NOW()`,
      [clerkUserId, email, fullName]
    );

    // Criar status pendente se não existir
    await query(
      `INSERT INTO apresentacao_partner.user_account_status (clerk_user_id, status, is_active)
       VALUES ($1, 'pending', false)
       ON CONFLICT (clerk_user_id) DO NOTHING`,
      [clerkUserId]
    );

    // Buscar dados completos do usuário
    const userResult = await query(
      `SELECT 
        p.clerk_user_id, p.email, p.full_name,
        s.status, s.is_active,
        r.role,
        c.company_id
       FROM apresentacao_partner.profiles p
       LEFT JOIN apresentacao_partner.user_account_status s ON s.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.user_roles r ON r.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.user_companies c ON c.clerk_user_id = p.clerk_user_id
       WHERE p.clerk_user_id = $1`,
      [clerkUserId]
    );

    res.json({ user: userResult.rows[0] });
  } catch (err) {
    console.error('Error in auth/sync:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar perfil do usuário logado
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        p.clerk_user_id, p.email, p.full_name,
        s.status, s.is_active,
        r.role,
        uc.company_id,
        co.company_name, co.logo_url, co.primary_color, co.secondary_color,
        co.accent_color, co.company_tagline, co.metrics_json, co.media_json,
        co.contact_phone, co.contact_email, co.contact_whatsapp,
        co.feedback_question, co.authority_quote, co.authority_quote_author, co.authority_quote_role,
        co.team_photo_url, co.mentor_photo_url, co.logo_negative_url,
        co.pdf_background_color, co.pdf_accent_color, co.pdf_logo_url, co.pdf_intro_text,
        co.contract_company_name, co.contract_cnpj, co.contract_address, 
        co.contract_city, co.contract_cep, co.contract_website
       FROM apresentacao_partner.profiles p
       LEFT JOIN apresentacao_partner.user_account_status s ON s.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.user_roles r ON r.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.user_companies uc ON uc.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.companies co ON co.id = uc.company_id
       WHERE p.clerk_user_id = $1`,
      [req.clerkUserId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// COMPANIES ENDPOINTS
// =====================================================

// Listar todas as companies (admin)
app.get('/api/companies', requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM apresentacao_partner.companies ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar company por ID
app.get('/api/companies/:id', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM apresentacao_partner.companies WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Company não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar company (admin)
app.post('/api/companies', requireAdmin, async (req, res) => {
  const { company_name, ...rest } = req.body;
  try {
    const result = await query(
      `INSERT INTO apresentacao_partner.companies (company_name, ${Object.keys(rest).join(', ')})
       VALUES ($1, ${Object.keys(rest).map((_, i) => `$${i + 2}`).join(', ')})
       RETURNING *`,
      [company_name, ...Object.values(rest)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar company
app.put('/api/companies/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

  try {
    const result = await query(
      `UPDATE apresentacao_partner.companies SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Company não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// UPLOAD DE IMAGENS (→ R2)
// =====================================================
app.post('/api/upload', requireAuth, upload.single('file'), async (req, res) => {
  const { folder } = req.body;
  const clerkUserId = req.clerkUserId;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: 'Tipo inválido. Use JPG, PNG ou WEBP.' });
  }

  try {
    const ext = file.originalname.split('.').pop();
    const key = `logos/${clerkUserId}/${folder || 'logos'}/${Date.now()}.${ext}`;

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    res.json({ url: publicUrl, key });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// GRUPOS CONSÓRCIO
// =====================================================
app.get('/api/grupos', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT g.*, 
        json_agg(a.* ORDER BY a.data_analise DESC) FILTER (WHERE a.id IS NOT NULL) as analises
       FROM apresentacao_partner.grupos_consorcio g
       LEFT JOIN apresentacao_partner.analises_mensais a ON a.grupo_id = g.id
       WHERE g.clerk_user_id = $1
       GROUP BY g.id
       ORDER BY g.created_at DESC`,
      [req.clerkUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/grupos/:id', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM apresentacao_partner.grupos_consorcio WHERE id = $1 AND clerk_user_id = $2`,
      [req.params.id, req.clerkUserId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Grupo não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/grupos', requireAuth, async (req, res) => {
  const { administradora, numero_grupo, prazo_meses, capacidade_cotas, 
          participantes_atual, data_inicio, data_fim } = req.body;
  try {
    const result = await query(
      `INSERT INTO apresentacao_partner.grupos_consorcio 
       (clerk_user_id, administradora, numero_grupo, prazo_meses, capacidade_cotas, 
        participantes_atual, data_inicio, data_fim)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.clerkUserId, administradora, numero_grupo, prazo_meses, 
       capacidade_cotas, participantes_atual, data_inicio, data_fim]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/grupos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  try {
    const result = await query(
      `UPDATE apresentacao_partner.grupos_consorcio SET ${setClauses} 
       WHERE id = $${keys.length + 1} AND clerk_user_id = $${keys.length + 2} RETURNING *`,
      [...Object.values(fields), id, req.clerkUserId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Grupo não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/grupos/:id', requireAuth, async (req, res) => {
  try {
    await query(
      `DELETE FROM apresentacao_partner.grupos_consorcio WHERE id = $1 AND clerk_user_id = $2`,
      [req.params.id, req.clerkUserId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar grupo com créditos
app.post('/api/grupos/com-creditos', requireAuth, async (req, res) => {
  const { grupo, creditos } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const grupoResult = await client.query(
      `INSERT INTO apresentacao_partner.grupos_consorcio 
       (clerk_user_id, administradora, numero_grupo, prazo_meses, capacidade_cotas, 
        participantes_atual, data_inicio, data_fim)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.clerkUserId, grupo.administradora, grupo.numero_grupo, grupo.prazo_meses,
       grupo.capacidade_cotas, grupo.participantes_atual, grupo.data_inicio, grupo.data_fim]
    );

    if (creditos && creditos.length > 0) {
      for (const c of creditos) {
        await client.query(
          `INSERT INTO apresentacao_partner.credit_price 
           (administradora, group_code, prazo_months, credito, parcela)
           VALUES ($1,$2,$3,$4,$5)`,
          [grupo.administradora, parseInt(grupo.numero_grupo), grupo.prazo_meses, c.credito, c.parcela]
        );
      }
    }
    await client.query('COMMIT');
    res.status(201).json(grupoResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// =====================================================
// ANÁLISES MENSAIS
// =====================================================
app.get('/api/grupos/:grupoId/analises', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.* FROM apresentacao_partner.analises_mensais a
       JOIN apresentacao_partner.grupos_consorcio g ON g.id = a.grupo_id
       WHERE a.grupo_id = $1 AND g.clerk_user_id = $2
       ORDER BY a.data_analise DESC LIMIT 6`,
      [req.params.grupoId, req.clerkUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/grupos/:grupoId/analises', requireAuth, async (req, res) => {
  const analise = req.body;
  try {
    const result = await query(
      `INSERT INTO apresentacao_partner.analises_mensais (
        grupo_id, mes_ano, data_analise,
        sorteio_ofertados, sorteio_contemplacoes, sorteio_percentual,
        lance_fixo_i_ofertados, lance_fixo_i_contemplacoes, lance_fixo_i_percentual,
        lance_fixo_ii_ofertados, lance_fixo_ii_contemplacoes, lance_fixo_ii_percentual,
        lance_livre_ofertados, lance_livre_contemplacoes, lance_livre_percentual,
        lance_limitado_ofertados, lance_limitado_contemplacoes, lance_limitado_percentual
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT (grupo_id, mes_ano) DO UPDATE SET
        data_analise = EXCLUDED.data_analise,
        sorteio_ofertados = EXCLUDED.sorteio_ofertados,
        sorteio_contemplacoes = EXCLUDED.sorteio_contemplacoes,
        sorteio_percentual = EXCLUDED.sorteio_percentual,
        lance_fixo_i_ofertados = EXCLUDED.lance_fixo_i_ofertados,
        lance_fixo_i_contemplacoes = EXCLUDED.lance_fixo_i_contemplacoes,
        lance_fixo_i_percentual = EXCLUDED.lance_fixo_i_percentual,
        lance_fixo_ii_ofertados = EXCLUDED.lance_fixo_ii_ofertados,
        lance_fixo_ii_contemplacoes = EXCLUDED.lance_fixo_ii_contemplacoes,
        lance_fixo_ii_percentual = EXCLUDED.lance_fixo_ii_percentual,
        lance_livre_ofertados = EXCLUDED.lance_livre_ofertados,
        lance_livre_contemplacoes = EXCLUDED.lance_livre_contemplacoes,
        lance_livre_percentual = EXCLUDED.lance_livre_percentual,
        lance_limitado_ofertados = EXCLUDED.lance_limitado_ofertados,
        lance_limitado_contemplacoes = EXCLUDED.lance_limitado_contemplacoes,
        lance_limitado_percentual = EXCLUDED.lance_limitado_percentual
      RETURNING *`,
      [req.params.grupoId, analise.mes_ano, analise.data_analise,
       analise.sorteio_ofertados||0, analise.sorteio_contemplacoes||0, analise.sorteio_percentual||0,
       analise.lance_fixo_i_ofertados||0, analise.lance_fixo_i_contemplacoes||0, analise.lance_fixo_i_percentual||0,
       analise.lance_fixo_ii_ofertados||0, analise.lance_fixo_ii_contemplacoes||0, analise.lance_fixo_ii_percentual||0,
       analise.lance_livre_ofertados||0, analise.lance_livre_contemplacoes||0, analise.lance_livre_percentual||0,
       analise.lance_limitado_ofertados||0, analise.lance_limitado_contemplacoes||0, analise.lance_limitado_percentual||0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/analises/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  try {
    const result = await query(
      `UPDATE apresentacao_partner.analises_mensais SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...Object.values(fields), id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/analises/:id', requireAuth, async (req, res) => {
  try {
    await query(`DELETE FROM apresentacao_partner.analises_mensais WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// CREDIT PRICE
// =====================================================
app.get('/api/credits', requireAuth, async (req, res) => {
  const { administradora } = req.query;
  try {
    let q = `SELECT * FROM apresentacao_partner.credit_price`;
    const params = [];
    if (administradora) {
      q += ` WHERE administradora = $1`;
      params.push(administradora);
    }
    q += ' ORDER BY administradora, prazo_months';
    const result = await query(q, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// ADMIN: Gestão de Usuários
// =====================================================
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        p.clerk_user_id, p.email, p.full_name, p.created_at,
        s.status, s.is_active, s.approved_at,
        r.role,
        co.company_name
       FROM apresentacao_partner.profiles p
       LEFT JOIN apresentacao_partner.user_account_status s ON s.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.user_roles r ON r.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.user_companies uc ON uc.clerk_user_id = p.clerk_user_id
       LEFT JOIN apresentacao_partner.companies co ON co.id = uc.company_id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users/:userId/approve', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role = 'partner', company_id = '00000000-0000-0000-0000-000000000001' } = req.body;
  try {
    await query(
      `SELECT apresentacao_partner.approve_user($1, $2, $3, $4)`,
      [req.clerkUserId, userId, role, company_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:userId', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role, company_id, is_active, full_name } = req.body;
  try {
    if (role) {
      await query(
        `INSERT INTO apresentacao_partner.user_roles (clerk_user_id, role)
         VALUES ($1, $2) ON CONFLICT (clerk_user_id) DO UPDATE SET role = $2`,
        [userId, role]
      );
    }
    if (company_id) {
      await query(
        `INSERT INTO apresentacao_partner.user_companies (clerk_user_id, company_id)
         VALUES ($1, $2) ON CONFLICT (clerk_user_id) DO UPDATE SET company_id = $2`,
        [userId, company_id]
      );
    }
    if (is_active !== undefined) {
      await query(
        `UPDATE apresentacao_partner.user_account_status SET is_active = $1 WHERE clerk_user_id = $2`,
        [is_active, userId]
      );
    }
    if (full_name) {
      await query(
        `UPDATE apresentacao_partner.profiles SET full_name = $1 WHERE clerk_user_id = $2`,
        [full_name, userId]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// ADMINISTRADORAS
// =====================================================
app.get('/api/administradoras', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM apresentacao_partner.administradoras_info ORDER BY ranking_abac ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// SERVIR O FRONTEND ESTÁTICO (em produção)
// =====================================================
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 API Server rodando na porta ${PORT}`);
  console.log(`📊 Conectado ao Postgres: ${DB_URL.split('@')[1]}`);
});
