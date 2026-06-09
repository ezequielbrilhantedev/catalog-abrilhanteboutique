-- Selos e preço promocional nos produtos (design Brilhante Boutique)
-- badge: rótulo curto exibido na vitrine (ex.: "Novo", "Promo"); null = sem selo
-- original_price: preço "de" riscado quando há promoção; null = sem promoção
alter table products
  add column if not exists badge text,
  add column if not exists original_price numeric(10, 2);
