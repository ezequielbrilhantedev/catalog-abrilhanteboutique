export interface Category {
  id: string
  name: string
  slug: string
  display_order: number
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number | null
  original_price: number | null
  badge: string | null
  category_id: string | null
  image_url: string | null
  images: string[] | null
  active: boolean
  created_at: string
  categories?: Category | null
}

export interface CartItem {
  product: Product
  quantity: number
}
