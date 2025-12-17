import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar se é admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData || roleData.role !== 'admin') {
      console.error('Authorization error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { companyId } = await req.json();

    if (!companyId) {
      return new Response(
        JSON.stringify({ error: 'Missing companyId parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Fetching users for company: ${companyId}`);

    // Buscar user_ids vinculados à empresa
    const { data: linkedData, error: linkedError } = await supabaseAdmin
      .from('user_companies')
      .select('user_id, created_at')
      .eq('company_id', companyId);

    if (linkedError) {
      console.error('Error fetching linked users:', linkedError);
      throw linkedError;
    }

    if (!linkedData || linkedData.length === 0) {
      console.log('No linked users found');
      return new Response(
        JSON.stringify([]),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const userIds = linkedData.map(l => l.user_id);
    console.log(`Found ${userIds.length} linked user IDs`);

    // Buscar detalhes dos usuários em paralelo
    const [authUsersResults, rolesData, statusData] = await Promise.all([
      Promise.all(userIds.map(id => supabaseAdmin.auth.admin.getUserById(id))),
      supabaseAdmin.from('user_roles').select('user_id, role').in('user_id', userIds),
      supabaseAdmin.from('user_account_status').select('user_id, is_active').in('user_id', userIds)
    ]);

    // Criar lookup maps
    const roleMap = new Map((rolesData.data || []).map(r => [r.user_id, r.role]));
    const statusMap = new Map((statusData.data || []).map(s => [s.user_id, s.is_active]));
    const createdAtMap = new Map(linkedData.map(l => [l.user_id, l.created_at]));

    // Montar resultado
    const users = authUsersResults
      .filter(r => r.data.user)
      .map(r => {
        const authUser = r.data.user!;
        return {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || 'Sem nome',
          role: roleMap.get(authUser.id) || 'partner',
          is_active: statusMap.get(authUser.id) ?? true,
          created_at: createdAtMap.get(authUser.id) || authUser.created_at
        };
      });

    console.log(`Returning ${users.length} users`);

    return new Response(
      JSON.stringify(users),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in get-company-users function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
