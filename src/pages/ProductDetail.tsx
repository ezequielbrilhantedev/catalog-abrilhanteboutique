import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import { useCartStore } from '../store/cart'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PriceTag } from '../components/ui/PriceTag'

const FEATURES = ['Folheado a ouro 18k', 'Garantia de 1 ano', 'Enviamos para todo o Brasil']

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useProduct(id!)
  const addItem = useCartStore((s) => s.addItem)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-narrow animate-pulse px-6 py-8">
        <div className="mb-6 h-6 w-24 rounded bg-sunken" />
        <div className="grid gap-7 md:grid-cols-2">
          <div className="aspect-[3/4] rounded-xl bg-sunken" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-sunken" />
            <div className="h-6 w-1/3 rounded bg-sunken" />
            <div className="h-20 rounded bg-sunken" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-narrow px-6 py-16 text-center">
        <p className="font-sans text-muted">Produto não encontrado.</p>
        <Link to="/" className="mt-4 inline-block text-gold-text hover:underline">
          Voltar à vitrine
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-narrow px-6 pb-16 pt-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-gold-text"
      >
        <ArrowLeft size={16} />
        Voltar à vitrine
      </button>

      <div className="grid items-start gap-7 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-xl border border-soft bg-sunken">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-gold-700" style={{ fontSize: 56 }}>
              ◈
            </div>
          )}
        </div>

        <div className="flex min-h-full flex-col">
          <div className="mb-3 flex items-center gap-2">
            {product.categories && <span className="bb-eyebrow text-xs">{product.categories.name}</span>}
            {product.badge && <Badge tone="gold">{product.badge}</Badge>}
          </div>

          <h1 style={{ fontSize: '2.25rem', lineHeight: 1.1 }}>{product.name}</h1>

          <div className="my-4">
            <PriceTag value={product.price} original={product.original_price} size="lg" />
          </div>

          {product.description && (
            <p className="m-0 font-sans text-base leading-relaxed text-muted">{product.description}</p>
          )}

          <ul className="mt-6 flex list-none flex-col gap-2 p-0">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 font-sans text-sm text-body">
                <span className="text-gold-400">◆</span> {f}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button variant="primary" size="lg" block onClick={() => addItem(product)}>
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
