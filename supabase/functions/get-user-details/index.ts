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
    const { data: { user: requestingUser } } = await supabaseAdmin.auth.getUser(token)

    if (!requestingUser) {
      throw new Error('Unauthorized')
    }

    // Verificar se o usuário requisitante é admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requestingUser.id)
      .single()

    if (!roleData || roleData.role !== 'admin') {
      throw new Error('Only admins can access user details')
    }

    // Buscar userId da query string
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Fetching details for user:', userId)

    // Buscar dados do usuário via Admin API
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError) {
      console.error('Error fetching user:', userError)
      throw userError
    }

    // Buscar role
    const { data: userRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    console.log('User role fetched:', userRole)

    // Buscar company vinculada
    const { data: userCompany } = await supabaseAdmin
      .from('user_companies')
      .select('company_id')
      .eq('user_id', userId)
      .single()

    console.log('User company fetched:', userCompany)

    const result = {
      id: userData.user.id,
      email: userData.user.email,
      fullName: userData.user.user_metadata?.full_name || '',
      role: userRole?.role || 'partner',
      companyId: userCompany?.company_id || null
    }

    console.log('User details fetched successfully')

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-user-details:', error)
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
