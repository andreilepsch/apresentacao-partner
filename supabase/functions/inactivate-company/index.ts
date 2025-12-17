import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Verificar se é admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!roleData || roleData.role !== 'admin') {
      throw new Error('Only admins can inactivate companies')
    }

    const { companyId, isActive } = await req.json()

    console.log(`Admin ${user.id} ${isActive ? 'reactivating' : 'inactivating'} company ${companyId}`)

    // Atualizar empresa
    const { error: companyError } = await supabaseAdmin
      .from('companies')
      .update({ is_active: isActive })
      .eq('id', companyId)

    if (companyError) throw companyError

    // Buscar todos os usuários vinculados
    const { data: linkedUsers, error: linkedError } = await supabaseAdmin
      .from('user_companies')
      .select('user_id')
      .eq('company_id', companyId)

    if (linkedError) throw linkedError

    if (linkedUsers && linkedUsers.length > 0) {
      const userIds = linkedUsers.map(u => u.user_id)
      
      // Atualizar status de todos os usuários vinculados
      const { error: usersError } = await supabaseAdmin
        .from('user_account_status')
        .update({ is_active: isActive })
        .in('user_id', userIds)

      if (usersError) throw usersError

      console.log(`${isActive ? 'Reactivated' : 'Inactivated'} ${userIds.length} users from company ${companyId}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        affectedUsers: linkedUsers?.length || 0 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in inactivate-company:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
