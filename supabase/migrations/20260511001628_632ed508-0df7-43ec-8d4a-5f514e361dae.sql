
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles readable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insert by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles update by owner" on public.profiles for update using (auth.uid() = id);

-- Garden state (one row per user)
create table public.garden_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.garden_states enable row level security;

create policy "Garden readable by owner" on public.garden_states for select using (auth.uid() = user_id);
create policy "Garden insert by owner" on public.garden_states for insert with check (auth.uid() = user_id);
create policy "Garden update by owner" on public.garden_states for update using (auth.uid() = user_id);

-- Auto-create profile + empty garden on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  insert into public.garden_states (user_id, state) values (new.id, '{}'::jsonb);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger garden_touch before update on public.garden_states
  for each row execute function public.touch_updated_at();
