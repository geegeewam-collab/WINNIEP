-- WINNIEP database schema
-- Run once: Supabase dashboard -> SQL Editor -> New query -> paste this -> Run.
-- Safe to re-run (uses IF NOT EXISTS where possible).

create extension if not exists pgcrypto;

create sequence if not exists order_ref_seq start 1001;

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ───────── Categories ─────────
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ───────── Products (images = [{url, public_id}, ...] — first one is the main photo) ─────────
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text,
  sku            text unique,
  category_id    uuid references categories(id) on delete set null,
  price          integer not null check (price >= 0),
  original_price integer check (original_price is null or original_price >= 0),
  availability   text not null default 'available'
                 check (availability in ('available', 'confirmation_required', 'unavailable')),
  images         jsonb not null default '[]'::jsonb,
  is_featured    boolean not null default false,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists products_published_idx on products (is_published, created_at desc);
create index if not exists products_category_idx on products (category_id);

-- ───────── Orders ─────────
create table if not exists orders (
  id                    uuid primary key default gen_random_uuid(),
  reference             text not null unique default ('WNP-' || nextval('order_ref_seq')),
  public_token          uuid not null unique default gen_random_uuid(),
  customer_name         text not null,
  customer_phone        text not null,
  customer_email        text,
  delivery_county       text not null,
  delivery_town         text not null,
  delivery_instructions text,
  subtotal              integer not null check (subtotal >= 0),
  delivery_fee          integer check (delivery_fee is null or delivery_fee >= 0), -- NULL = not quoted yet
  fulfilment_status     text not null default 'awaiting_availability'
                        check (fulfilment_status in ('awaiting_availability', 'awaiting_delivery_quote',
                               'awaiting_customer_approval', 'awaiting_payment', 'processing',
                               'dispatched', 'delivered', 'cancelled')),
  payment_status        text not null default 'not_started'
                        check (payment_status in ('not_started', 'pending', 'successful', 'failed', 'cancelled', 'expired')),
  admin_notes           text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists orders_status_idx on orders (fulfilment_status);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  product_id     uuid references products(id) on delete set null,
  name_snapshot  text not null,
  sku_snapshot   text,
  price_snapshot integer not null check (price_snapshot >= 0),
  quantity       integer not null check (quantity > 0),
  image_snapshot text
);
create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists payments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders(id) on delete cascade,
  transaction_ref     text unique,          -- M-PESA CheckoutRequestID
  merchant_request_id text,
  amount              integer not null,
  phone               text,
  status              text not null default 'pending' check (status in ('pending', 'successful', 'failed')),
  mpesa_receipt       text,
  result_desc         text,
  provider            text not null default 'mpesa',
  created_at          timestamptz not null default now()
);
create index if not exists payments_order_idx on payments (order_id);

-- ───────── Store settings (single row) ─────────
create table if not exists store_settings (
  id                int primary key default 1 check (id = 1),
  whatsapp_number   text not null default '254756374843',
  store_email       text,
  announcement_text text,
  delivery_rules    jsonb not null default '[]'::jsonb,  -- [{"county": "Nairobi", "fee": 300}, ...]
  updated_at        timestamptz not null default now()
);
insert into store_settings (id) values (1) on conflict (id) do nothing;

-- ───────── updated_at triggers ─────────
drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products for each row execute function set_updated_at();
drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();
drop trigger if exists settings_updated_at on store_settings;
create trigger settings_updated_at before update on store_settings for each row execute function set_updated_at();

-- ───────── Security: lock everything down ─────────
-- The app talks to the database only from the server using the service-role key,
-- so we enable RLS with NO policies: the public anon key can read/write nothing.
alter table categories     enable row level security;
alter table products       enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
alter table payments       enable row level security;
alter table store_settings enable row level security;

-- ───────── Starter categories ─────────
insert into categories (name, slug, sort_order) values
  ('Household',   'household',   1),
  ('Electronics', 'electronics', 2),
  ('Décor',       'decor',       3)
on conflict (slug) do nothing;
