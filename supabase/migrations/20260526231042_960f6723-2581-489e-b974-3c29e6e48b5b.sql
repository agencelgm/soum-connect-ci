
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;

DO $$
DECLARE
  v_temp_password text := 'LGM-Temp-2026!';
  v_user_id uuid;
  v_rec record;
  v_staff record;
BEGIN
  FOR v_staff IN
    SELECT * FROM (VALUES
      ('agencelgm@gmail.com', 'admin'::public.app_role, 'Koffi Kader Konan'),
      ('fatemexpertjuniorlgm@gmail.com', 'agent'::public.app_role, 'Fatema'),
      ('gracecoordlgm@gmail.com', 'agent'::public.app_role, 'Grace'),
      ('loistianoulgm@gmail.com', 'agent'::public.app_role, 'Lois Tianou')
    ) AS t(email, role, full_name)
  LOOP
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_staff.email LIMIT 1;
    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token,
        email_change_token_new, email_change
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        v_staff.email,
        extensions.crypt(v_temp_password, extensions.gen_salt('bf')),
        now(),
        jsonb_build_object('provider','email','providers',ARRAY['email']),
        jsonb_build_object('full_name', v_staff.full_name),
        now(), now(), '', '', '', ''
      );
    END IF;

    INSERT INTO public.profiles (id, email, full_name, must_change_password)
      VALUES (v_user_id, v_staff.email, v_staff.full_name, true)
      ON CONFLICT (id) DO UPDATE SET must_change_password = true;

    INSERT INTO public.user_roles (user_id, role)
      VALUES (v_user_id, v_staff.role)
      ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;
