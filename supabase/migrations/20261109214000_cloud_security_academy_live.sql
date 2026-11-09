-- Cloud Security Academy backend for the existing live SecLoudive schema.
-- Existing profiles use role text/is_admin boolean; do not replace that contract.

create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null default '',
  level text not null default 'foundation' check (level in ('foundation', 'intermediate', 'advanced')),
  published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.security_resources (
  id uuid primary key default gen_random_uuid(),
  path_id uuid references public.learning_paths(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(trim(title)) between 1 and 180),
  summary text not null default '',
  category text not null default 'cloud-security' check (char_length(trim(category)) between 1 and 80),
  resource_type text not null default 'lesson' check (resource_type in ('lesson', 'lab', 'assessment', 'reference')),
  level text not null default 'foundation' check (level in ('foundation', 'intermediate', 'advanced')),
  duration_minutes integer not null default 15 check (duration_minutes between 1 and 1440),
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resource_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.security_resources(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  percent integer not null default 0 check (percent between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, resource_id)
);

create index if not exists learning_paths_published_idx on public.learning_paths(published, updated_at desc);
create index if not exists security_resources_path_idx on public.security_resources(path_id, published, updated_at desc);
create index if not exists security_resources_category_idx on public.security_resources(category, level, published);
create index if not exists resource_progress_user_idx on public.resource_progress(user_id, updated_at desc);

create or replace function public.academy_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (coalesce(is_admin, false) or lower(coalesce(role, '')) = 'admin')
  );
$$;

create or replace function public.touch_academy_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists learning_paths_touch_updated_at on public.learning_paths;
create trigger learning_paths_touch_updated_at before update on public.learning_paths
for each row execute procedure public.touch_academy_updated_at();

drop trigger if exists security_resources_touch_updated_at on public.security_resources;
create trigger security_resources_touch_updated_at before update on public.security_resources
for each row execute procedure public.touch_academy_updated_at();

drop trigger if exists resource_progress_touch_updated_at on public.resource_progress;
create trigger resource_progress_touch_updated_at before update on public.resource_progress
for each row execute procedure public.touch_academy_updated_at();

alter table public.learning_paths enable row level security;
alter table public.security_resources enable row level security;
alter table public.resource_progress enable row level security;

drop policy if exists "academy read published paths" on public.learning_paths;
create policy "academy read published paths" on public.learning_paths
for select using (auth.uid() is not null and (published or public.academy_is_admin()));

drop policy if exists "academy admins manage paths" on public.learning_paths;
create policy "academy admins manage paths" on public.learning_paths
for all using (public.academy_is_admin()) with check (public.academy_is_admin());

drop policy if exists "academy read published resources" on public.security_resources;
create policy "academy read published resources" on public.security_resources
for select using (auth.uid() is not null and (published or public.academy_is_admin()));

drop policy if exists "academy admins manage resources" on public.security_resources;
create policy "academy admins manage resources" on public.security_resources
for all using (public.academy_is_admin()) with check (public.academy_is_admin());

drop policy if exists "academy users read own progress" on public.resource_progress;
create policy "academy users read own progress" on public.resource_progress
for select using (user_id = auth.uid() or public.academy_is_admin());

drop policy if exists "academy users insert own progress" on public.resource_progress;
create policy "academy users insert own progress" on public.resource_progress
for insert with check (user_id = auth.uid());

drop policy if exists "academy users update own progress" on public.resource_progress;
create policy "academy users update own progress" on public.resource_progress
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on function public.academy_is_admin() from public;
grant execute on function public.academy_is_admin() to authenticated;
