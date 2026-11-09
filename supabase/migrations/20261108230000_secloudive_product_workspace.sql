create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 160),
  description text not null default '',
  price numeric(12, 2) not null default 0 check (price >= 0),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index products_owner_created_idx on public.products(owner_id, created_at desc);
create index activities_actor_created_idx on public.activities(actor_id, created_at desc);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.log_product_activity()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.activities(actor_id, action, entity_type, entity_id)
  values (auth.uid(), tg_op, 'product', coalesce(new.id, old.id));
  return coalesce(new, old);
end;
$$;

create trigger product_activity_log
  after insert or update or delete on public.products
  for each row execute procedure public.log_product_activity();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.activities enable row level security;

create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admins update roles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
create policy "users read own products" on public.products for select using (owner_id = auth.uid() or public.is_admin());
create policy "users create own products" on public.products for insert with check (owner_id = auth.uid());
create policy "users update own products" on public.products for update using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy "users delete own products" on public.products for delete using (owner_id = auth.uid() or public.is_admin());
create policy "users read own activity" on public.activities for select using (actor_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', false)
on conflict (id) do nothing;

create policy "users manage own product images" on storage.objects
for all using (bucket_id = 'product-images' and owner_id = auth.uid())
with check (bucket_id = 'product-images' and owner_id = auth.uid());
