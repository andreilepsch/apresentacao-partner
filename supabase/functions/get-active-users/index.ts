import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('User authenticated:', user.id);

    // Verificar se é admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || roleData?.role !== 'admin') {
      console.error('Role check failed:', roleError, roleData);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }), 
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Admin verified, fetching active users...');

    // Buscar usuários com status 'approved'
    const { data: approvedStatuses, error: statusError } = await supabaseAdmin
      .from('user_account_status')
      .select('user_id, approved_at, approved_by, is_active')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false });

    if (statusError) {
      console.error('Error fetching approved statuses:', statusError);
      return new Response(
        JSON.stringify({ error: statusError.message }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${approvedStatuses?.length || 0} approved users`);

    // Buscar todos os admins que NÃO têm registro na tabela user_account_status
    const { data: allAdmins } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    const adminIds = allAdmins?.map(a => a.user_id) || [];
    const approvedUserIds = approvedStatuses?.map(s => s.user_id) || [];
    const adminsWithoutStatus = adminIds.filter(id => !approvedUserIds.includes(id));

    console.log(`Found ${adminsWithoutStatus.length} admins without status`);

    // Criar registros virtuais para admins sem status (tratá-los como aprovados e ativos)
    const adminStatusRecords = adminsWithoutStatus.map(userId => ({
      user_id: userId,
      approved_at: null,
      approved_by: null,
      is_active: true
    }));

    // Combinar usuários aprovados com admins sem status
    const allActiveUsers = [...(approvedStatuses || []), ...adminStatusRecords];

    if (allActiveUsers.length === 0) {
      return new Response(
        JSON.stringify([]),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extrair IDs para otimizar queries
    const userIds = allActiveUsers.map(s => s.user_id);

    // Query única para buscar todas as roles de uma vez (elimina N queries)
    const { data: rolesData } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    // Buscar metadados de auth em paralelo (necessário para email)
    const authUsersPromises = userIds.map(id => 
      supabaseAdmin.auth.admin.getUserById(id)
    );
    const authUsersResults = await Promise.all(authUsersPromises);

    // Buscar vinculações de empresas
    const { data: userCompaniesData } = await supabaseAdmin
      .from('user_companies')
      .select('user_id, company_id')
      .in('user_id', userIds);

    // Extrair company_ids únicos
    const companyIds = Array.from(new Set(
      (userCompaniesData || [])
        .map(uc => uc.company_id)
        .filter(Boolean)
    ));

    // Buscar company_names da tabela companies
    const { data: companiesData } = await supabaseAdmin
      .from('companies')
      .select('id, company_name')
      .in('id', companyIds);

    // Criar lookup maps para acesso O(1)
    const roleMap = new Map(rolesData?.map(r => [r.user_id, r.role]) || []);
    const userCompanyMap = new Map((userCompaniesData || []).map(uc => [uc.user_id, uc.company_id]));
    const companyNameMap = new Map((companiesData || []).map(c => [c.id, c.company_name]));

    // Montar resultado final
    const activeUsers = allActiveUsers.map((status, index) => {
      const authResult = authUsersResults[index];
      const authUser = authResult.data.user;
      const companyId = userCompanyMap.get(status.user_id);
      const companyName = companyId ? (companyNameMap.get(companyId) || 'Sem empresa') : 'Sem empresa';
      
      return {
        id: status.user_id,
        user_id: status.user_id,
        email: authUser?.email || 'N/A',
        full_name: authUser?.user_metadata?.full_name || 'Sem nome',
        role: roleMap.get(status.user_id) || 'user',
        company_name: companyName,
        approved_at: status.approved_at,
        is_active: status.is_active ?? true
      };
    });

    console.log('Returning active users with details');

    return new Response(
      JSON.stringify(activeUsers),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
