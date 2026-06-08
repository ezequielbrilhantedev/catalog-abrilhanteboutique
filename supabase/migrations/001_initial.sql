-- Categorias
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  display_order int default 0
);

-- Produtos
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid references categories(id) on delete set null,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- RLS
alter table categories enable row level security;
alter table products enable row level security;

-- Leitura pública
create policy "public read categories" on categories for select using (true);
create policy "public read active products" on products for select using (true);

-- Escrita apenas para autenticados
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated');
create policy "admin write products" on products for all using (auth.role() = 'authenticated');

-- Storage bucket (execute no dashboard do Supabase)
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
-- create policy "public read images" on storage.objects for select using (bucket_id = 'product-images');
-- create policy "admin upload images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
