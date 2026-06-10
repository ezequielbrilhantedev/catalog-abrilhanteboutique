-- Galeria de fotos por produto (carrossel no detalhe do produto)
-- images: lista ordenada de URLs; a primeira é a capa (espelhada em image_url
-- para compatibilidade com a vitrine e o carrinho)
alter table products
  add column if not exists images text[] not null default '{}';

-- Produtos existentes: a foto única vira a primeira da galeria
update products
  set images = array[image_url]
  where image_url is not null
    and (images is null or cardinality(images) = 0);
