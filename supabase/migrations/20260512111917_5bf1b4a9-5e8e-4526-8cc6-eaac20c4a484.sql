-- Extend profiles with Google/OAuth metadata + preferences
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_id TEXT,
  ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Recreate signup handler to capture Google identity fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  meta jsonb := COALESCE(new.raw_user_meta_data, '{}'::jsonb);
  prov text := COALESCE(new.raw_app_meta_data->>'provider', 'email');
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, provider, provider_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(meta->>'display_name', meta->>'full_name', meta->>'name', split_part(new.email, '@', 1)),
    COALESCE(meta->>'avatar_url', meta->>'picture'),
    prov,
    COALESCE(meta->>'sub', meta->>'provider_id')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    provider = EXCLUDED.provider,
    provider_id = COALESCE(EXCLUDED.provider_id, public.profiles.provider_id);

  INSERT INTO public.garden_states (user_id, state)
  VALUES (new.id, '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- Backfill profiles for existing users
INSERT INTO public.profiles (id, email, display_name, avatar_url, provider, provider_id)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  COALESCE(u.raw_app_meta_data->>'provider', 'email'),
  COALESCE(u.raw_user_meta_data->>'sub', u.raw_user_meta_data->>'provider_id')
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
  provider = EXCLUDED.provider,
  provider_id = COALESCE(EXCLUDED.provider_id, public.profiles.provider_id);
