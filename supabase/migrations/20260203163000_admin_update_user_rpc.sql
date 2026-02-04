CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
    _user_id uuid,
    _full_name text,
    _email text,
    _role text,
    _company_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    -- 1. Check permissions (Admin only)
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied. Only admins can update users.';
    END IF;

    -- 2. Update Profile
    UPDATE public.profiles
    SET full_name = _full_name,
        email = _email,
        updated_at = now()
    WHERE id = _user_id;

    -- 3. Update Auth User (Email and Meta)
    -- This allows changing the login email directly
    UPDATE auth.users
    SET email = _email,
        raw_user_meta_data = 
            COALESCE(raw_user_meta_data, '{}'::jsonb) || 
            jsonb_build_object('full_name', _full_name),
        updated_at = now()
    WHERE id = _user_id;

    -- 4. Update Role
    -- Clear existing roles
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    -- Insert new role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, _role::app_role);

    -- 5. Update Company Linkage
    IF _company_name IS NOT NULL AND _company_name != '' THEN
        -- Find or Create Company
        SELECT id INTO v_company_id FROM public.companies WHERE company_name = _company_name LIMIT 1;
        
        IF v_company_id IS NULL THEN
            INSERT INTO public.companies (company_name, is_active)
            VALUES (_company_name, true)
            RETURNING id INTO v_company_id;
        END IF;

        -- Update Link User to Company (Clean previous links)
        DELETE FROM public.user_companies WHERE user_id = _user_id;
        INSERT INTO public.user_companies (user_id, company_id) VALUES (_user_id, v_company_id);

        -- Update Legacy Branding
        DELETE FROM public.user_branding WHERE user_id = _user_id;
        INSERT INTO public.user_branding (user_id, company_name) VALUES (_user_id, _company_name);
        
        -- Update user metadata with company info
        UPDATE auth.users
        SET raw_user_meta_data = 
            COALESCE(raw_user_meta_data, '{}'::jsonb) || 
            jsonb_build_object('company_id', v_company_id, 'company_name', _company_name)
        WHERE id = _user_id;
    END IF;

END;
$$;
