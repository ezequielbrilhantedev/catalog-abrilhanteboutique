import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import { useCartStore } from '../store/cart'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useProduct(id!)
  const addItem = useCartStore((s) => s.addItem)

  const formatted = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Produto não encontrado.</p>
        <Link to="/" className="text-brand-600 hover:underline mt-4 inline-block">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={64} />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.categories && (
            <span className="text-sm text-brand-500 font-medium mb-2">
              {product.categories.name}
            </span>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-3xl font-bold text-brand-600 mt-3">
            {formatted(product.price)}
          </p>
          {product.description && (
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          )}
          <button
            onClick={() => addItem(product)}
            className="mt-auto pt-6 w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag size={20} />
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
