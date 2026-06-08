import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Category } from '../types'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as Category[]
    },
  })
}
