-- Urban Motion — Setup Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela de produtos
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null,
  image_url text,
  sizes jsonb default '["P","M","G","GG"]'::jsonb,
  stock integer default 0,
  created_at timestamptz default now()
);

-- Tabela de clientes (opcional)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  supabase_user_id uuid,
  name text,
  document text,
  phone text,
  created_at timestamptz default now()
);

-- Tabela de pedidos
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  customer_name text,
  customer_email text,
  customer_document text,
  shipping_address jsonb,
  status text not null default 'pending'
    check (status in ('pending','paid','canceled','shipped')),
  total_cents integer not null,
  shipping_price_cents integer not null default 0,
  payment_provider text default 'mercadopago',
  payment_status text not null default 'pending'
    check (payment_status in ('pending','approved','rejected')),
  payment_reference_id text,
  created_at timestamptz default now()
);

-- Tabela de itens do pedido
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  size text not null,
  quantity integer not null,
  unit_price_cents integer not null
);

-- Dados de exemplo
insert into products (name, description, price_cents, image_url, sizes) values
  ('Urban Classic', 'Camiseta essencial Urban Motion — 100% algodão penteado', 8990, '', '["P","M","G","GG"]'),
  ('Motion Tee', 'Para quem está sempre em movimento', 9990, '', '["P","M","G"]'),
  ('Street Essential', 'O básico que não é básico', 7990, '', '["M","G","GG"]'),
  ('Monochrome Flow', 'Preto e branco como manifesto', 11990, '', '["P","M","G","GG","XGG"]');
