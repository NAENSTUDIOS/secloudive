-- SecLoudive standalone Supabase schema.
-- Apply this to a fresh Supabase project. For an existing project, apply the
-- timestamped migrations in supabase/migrations/ in chronological order.

create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum ('admin', 'user');
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 160),
  email text not null default '' check (char_length(email) <= 320),
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null default '',
  price numeric(12, 2) not null default 0 check (price >= 0),
  category text not null default 'general'
    check (char_length(trim(category)) between 1 and 80),
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity between 1 and 100000),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  total_amount numeric(14, 2) not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists products_owner_created_idx
  on public.products(owner_id, created_at desc);
create index if not exists products_category_created_idx
  on public.products(category, created_at desc);
create index if not exists orders_user_created_idx
  on public.orders(user_id, created_at desc);
create index if not exists orders_product_created_idx
  on public.orders(product_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.email, ''))
  on conflict (id) do update
  set name = excluded.name, email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_order_amounts()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  current_price numeric(12, 2);
begin
  select price into current_price from public.products where id = new.product_id;
  if current_price is null then
    raise exception 'Product % does not exist', new.product_id using errcode = '23503';
  end if;
  new.unit_price := current_price;
  new.total_amount := round(current_price * new.quantity, 2);
  return new;
end;
$$;

drop trigger if exists orders_set_amounts on public.orders;
create trigger orders_set_amounts
before insert or update of product_id, quantity on public.orders
for each row execute procedure public.set_order_amounts();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles read self or admin" on public.profiles;
create policy "profiles read self or admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles update self or admin" on public.profiles;
create policy "profiles update self or admin" on public.profiles
for update using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

revoke update on public.profiles from authenticated;
grant update (name, email) on public.profiles to authenticated;

create or replace function public.admin_set_user_role(
  target_user_id uuid,
  next_role public.app_role
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only administrators may change roles' using errcode = '42501';
  end if;
  update public.profiles set role = next_role where id = target_user_id;
  if not found then
    raise exception 'Profile does not exist' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, public.app_role) from public;
grant execute on function public.admin_set_user_role(uuid, public.app_role) to authenticated;

drop policy if exists "authenticated users read products" on public.products;
create policy "authenticated users read products" on public.products
for select using (auth.uid() is not null);

drop policy if exists "users create own products" on public.products;
create policy "users create own products" on public.products
for insert with check (owner_id = auth.uid());

drop policy if exists "owners or admins update products" on public.products;
create policy "owners or admins update products" on public.products
for update using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "owners or admins delete products" on public.products;
create policy "owners or admins delete products" on public.products
for delete using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders" on public.orders
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "users create own orders" on public.orders;
create policy "users create own orders" on public.orders
for insert with check (user_id = auth.uid());

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete orders" on public.orders;
create policy "admins delete orders" on public.orders
for delete using (public.is_admin());

comment on table public.orders is
'Immutable order snapshots; unit_price and total_amount are server-derived.';
