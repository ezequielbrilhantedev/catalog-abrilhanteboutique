import { useState } from 'react'
import { CategoryFilter } from '../components/CategoryFilter'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'

export function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { data: categories = [] } = useCategories()
  const { data: products = [], isLoading, error } = useProducts(selectedCategory ?? undefined)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 mt-12">
          Erro ao carregar produtos. Tente novamente.
        </p>
      )}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-center text-gray-400 mt-12">
          Nenhum produto encontrado.
        </p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
