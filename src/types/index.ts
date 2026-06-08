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
  price: number
  category_id: string | null
  image_url: string | null
  active: boolean
  created_at: string
  categories?: Category | null
}

export interface CartItem {
  product: Product
  quantity: number
}
