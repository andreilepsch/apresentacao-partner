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

    // Verificar se usuário é admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Invalid token:', authError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar se é admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      console.error('User is not admin:', user.id);
      return new Response(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Admin verified, fetching pending users...');

    // Buscar usuários pendentes
    const { data: pendingStatuses, error: statusError } = await supabaseAdmin
      .from('user_account_status')
      .select('*')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (statusError) {
      console.error('Error fetching pending statuses:', statusError);
      return new Response(JSON.stringify({ error: statusError.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${pendingStatuses?.length || 0} pending users`);

    // Buscar dados completos de cada usuário
    const usersWithDetails = await Promise.all(
      (pendingStatuses || []).map(async (status) => {
        try {
          const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(status.user_id);
          
          if (userError) {
            console.error(`Error fetching user ${status.user_id}:`, userError);
          }
          
          return {
            ...status,
            email: authUser?.email || 'Email não disponível',
            full_name: authUser?.user_metadata?.full_name || null
          };
        } catch (error) {
          console.error(`Exception fetching user ${status.user_id}:`, error);
          return {
            ...status,
            email: 'Erro ao carregar',
            full_name: null
          };
        }
      })
    );

    console.log('Returning users with details');

    return new Response(JSON.stringify(usersWithDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error in get-pending-users:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
