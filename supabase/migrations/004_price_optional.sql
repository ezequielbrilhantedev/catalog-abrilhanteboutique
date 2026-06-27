-- Preço deixa de ser obrigatório (pode ser nulo = "Valor a consultar")
alter table products
  alter column price drop not null;
