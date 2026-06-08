import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

export function useProducts(categoryId?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, categories(id, name, slug, display_order)')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(id, name, slug, display_order)')
        .eq('id', id)
        .eq('active', true)
        .single()

      if (error) throw error
      return data as Product
    },
  })
}
