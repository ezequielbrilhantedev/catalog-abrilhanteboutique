import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { useCartStore } from '../store/cart'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/produto/${product.id}`}>
        <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={48} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-brand-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-brand-600">{formatted}</span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 bg-brand-600 text-white text-sm px-3 py-1.5 rounded-full hover:bg-brand-700 transition-colors"
          >
            <ShoppingBag size={14} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
