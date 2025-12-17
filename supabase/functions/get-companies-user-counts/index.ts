import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the user from the auth token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Create admin client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError) {
      console.error('Error checking user role:', roleError)
      throw new Error('Error checking user role')
    }

    if (!roleData || roleData.role !== 'admin') {
      throw new Error('Forbidden: User is not an admin')
    }

    console.log('✅ Admin verified, fetching user counts...')

    // Get all user-company mappings using service role to bypass RLS
    const { data: userCompanies, error: userCompaniesError } = await supabaseAdmin
      .from('user_companies')
      .select('company_id')

    if (userCompaniesError) {
      console.error('Error fetching user companies:', userCompaniesError)
      throw new Error('Error fetching user companies')
    }

    console.log('📊 User companies data:', userCompanies)

    // Create count map
    const countMap: Record<string, number> = {}
    userCompanies?.forEach((uc) => {
      countMap[uc.company_id] = (countMap[uc.company_id] || 0) + 1
    })

    console.log('📊 Count map:', countMap)

    return new Response(
      JSON.stringify({ counts: countMap }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('❌ Error in get-companies-user-counts:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden') ? 403 : 400,
      }
    )
  }
})
