import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '../types'
import { useCartStore } from '../store/cart'
import { PriceTag } from './ui/PriceTag'
import { Badge } from './ui/Badge'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [hover, setHover] = useState(false)

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="overflow-hidden rounded-lg bg-card"
      style={{
        border: '1px solid',
        borderColor: hover ? 'var(--border-gold)' : 'var(--border-soft)',
        boxShadow: hover ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition:
          'transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}
    >
      <Link to={`/produto/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-sunken">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{
              transition: 'transform var(--dur-slow) var(--ease-out)',
              transform: hover ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-gold-700" style={{ fontSize: 40 }}>
            ◈
          </div>
        )}
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge tone="gold">{product.badge}</Badge>
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/produto/${product.id}`}>
          <h3 className="m-0 truncate font-display text-lg font-semibold leading-tight text-strong">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <PriceTag value={product.price} original={product.original_price} size="md" />
          <button
            type="button"
            aria-label={`Adicionar ${product.name} ao carrinho`}
            onClick={() => addItem(product)}
            className="flex flex-shrink-0 items-center justify-center rounded-full"
            style={{
              width: 38,
              height: 38,
              border: '1px solid var(--border-gold)',
              background: hover ? 'var(--gold-sheen)' : 'transparent',
              color: hover ? 'var(--text-on-gold)' : 'var(--text-gold)',
              transition: 'all var(--dur-fast) var(--ease-out)',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
