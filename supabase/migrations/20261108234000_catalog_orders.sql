-- SecLoudive catalog and orders
-- Additive migration for the existing product workspace schema.
-- Requires Supabase Auth and the preceding product workspace migration.

create extension if not exists "pgcrypto";

-- Keep the existing profile fields used by the current frontend, while adding
-- the canonical API names requested by the product schema.
alter table public.profiles
  add column if not exists name text,
  add column if not exists email text;

update public.profiles p
set
  name = coalesce(p.name, p.full_name),
  email = coalesce(p.email, u.email)
from auth.users u
where u.id = p.id
  and (p.name is null or p.email is null);

alter table public.profiles
  alter column name set default '',
  alter column email set default '';

alter table public.products
  add column if not exists title text,
  add column if not exists category text;

update public.products
set title = coalesce(nullif(title, ''), name)
where title is null or title = '';

alter table public.products
  alter column title set default '',
  alter column category set default 'general';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_title_length'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_title_length
      check (char_length(trim(title)) between 1 and 160) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_category_length'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_category_length
      check (char_length(trim(category)) between 1 and 80) not valid;
  end if;
end;
$$;

create or replace function public.sync_product_catalog_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if nullif(trim(new.title), '') is null then
    new.title := new.name;
  end if;
  if nullif(trim(new.name), '') is null then
    new.name := new.title;
  end if;
  return new;
end;
$$;

drop trigger if exists products_sync_catalog_fields on public.products;
create trigger products_sync_catalog_fields
before insert or update of name, title on public.products
for each row execute procedure public.sync_product_catalog_fields();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity between 1 and 100000),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  total_amount numeric(14, 2) not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx
  on public.orders(user_id, created_at desc);

create index if not exists orders_product_created_idx
  on public.orders(product_id, created_at desc);

create index if not exists products_category_created_idx
  on public.products(category, created_at desc);

create or replace function public.set_order_amounts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_price numeric(12, 2);
begin
  select price into current_price
  from public.products
  where id = new.product_id;

  if current_price is null then
    raise exception 'Product % does not exist or has no price', new.product_id
      using errcode = '23503';
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

create or replace function public.sync_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set email = new.email, updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated_profile on auth.users;
create trigger on_auth_user_updated_profile
after update of email on auth.users
for each row execute procedure public.sync_profile_identity();

alter table public.orders enable row level security;

drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders"
on public.orders for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "users create own orders" on public.orders;
create policy "users create own orders"
on public.orders for insert
with check (user_id = auth.uid());

-- Orders are immutable purchase records. Cancellation/refunds should be
-- represented by a future order-status ledger, not UPDATE/DELETE access.

drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders"
on public.orders for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete orders" on public.orders;
create policy "admins delete orders"
on public.orders for delete
using (public.is_admin());

-- Authenticated users can browse catalog products to place orders. Product
-- mutations remain owner/admin controlled by the preceding migration policies.
drop policy if exists "authenticated users browse products" on public.products;
create policy "authenticated users browse products"
on public.products for select
using (auth.uid() is not null);

-- Allow a signed-in user to update their own display fields only.
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

-- Prevent self-escalation: authenticated clients may update profile details,
-- while role changes are available only through the admin RPC below.
revoke update on public.profiles from authenticated;
grant update (name, full_name, email, avatar_url) on public.profiles to authenticated;

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
  update public.profiles
  set role = next_role, updated_at = now()
  where id = target_user_id;
  if not found then
    raise exception 'Profile % does not exist', target_user_id using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, public.app_role) from public;
grant execute on function public.admin_set_user_role(uuid, public.app_role) to authenticated;

comment on table public.orders is
'Immutable order snapshots. unit_price and total_amount are server-derived from the product price.';
comment on column public.orders.total_amount is
'Server-calculated quantity multiplied by the product price at order time.';
