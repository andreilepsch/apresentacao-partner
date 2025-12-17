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
      throw new Error('Only admins can update users')
    }

    const { userId, fullName, email, role, companyName } = await req.json()

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Admin updating user:', userId)

    // Preparar metadata para atualização
    const userMetadata: any = {}
    if (fullName) userMetadata.full_name = fullName

    // Se companyName foi fornecido, buscar o company.id da tabela companies
    let companyId = null
    if (companyName) {
      const { data: company, error: companyError } = await supabaseAdmin
        .from('companies')
        .select('id')
        .eq('company_name', companyName)
        .limit(1)
        .single()

      if (companyError) {
        console.error('Error finding company:', companyError)
      } else if (company) {
        companyId = company.id
        console.log('Found company_id:', companyId)
      }
    }
    
    // Atualizar user_companies ao invés de user_metadata
    if (companyId) {
      const { error: ucError } = await supabaseAdmin
        .from('user_companies')
        .upsert({
          user_id: userId,
          company_id: companyId
        })
      
      if (ucError) {
        console.error('Error updating user_companies:', ucError)
      } else {
        console.log('User successfully linked to company')
      }
    } else {
      // Se não foi fornecido companyName, remover vinculação
      const { error: deleteError } = await supabaseAdmin
        .from('user_companies')
        .delete()
        .eq('user_id', userId)
      
      if (deleteError) {
        console.error('Error unlinking user from company:', deleteError)
      } else {
        console.log('User successfully unlinked from company')
      }
    }

    // Atualizar email e metadata
    const updateData: any = {}
    if (email) updateData.email = email
    if (Object.keys(userMetadata).length > 0) {
      updateData.user_metadata = userMetadata
    }

    if (Object.keys(updateData).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        updateData
      )

      if (authError) {
        console.error('Error updating auth user:', authError)
        throw authError
      }
    }

    // Atualizar role se fornecido
    if (role) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId)

      if (roleError) {
        console.error('Error updating role:', roleError)
        throw roleError
      }
    }

    console.log('User updated successfully by admin:', requestingUser.id)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in admin-update-user:', error)
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
