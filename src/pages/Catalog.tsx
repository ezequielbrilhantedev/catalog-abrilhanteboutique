import { useMemo, useState } from 'react'
import { CategoryFilter } from '../components/CategoryFilter'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useSearchStore } from '../store/search'

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { data: categories = [] } = useCategories()
  const { data: products = [], isLoading, error } = useProducts(selectedCategory ?? undefined)

  const query = useSearchStore((s) => s.query)

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return products
    return products.filter(
      (p) => normalize(p.name).includes(q) || normalize(p.description ?? '').includes(q)
    )
  }, [products, query])

  const showHero = !query.trim()

  return (
    <div>
      {showHero && (
        <section className="mx-auto max-w-container px-6 pb-10 pt-16 text-center">
          <div className="bb-eyebrow mb-3 text-xs">Semijoias &amp; Folheados</div>
          <h1 className="mx-auto max-w-2xl" style={{ fontSize: '4rem', lineHeight: 1.02 }}>
            As semijoias certas para você{' '}
            <em className="italic" style={{ color: 'var(--text-gold)' }}>
              brilhar
            </em>
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-sans text-lg leading-relaxed text-muted">
            Peças folheadas a ouro 18k, escolhidas a dedo. Monte seu pedido e finalize pelo WhatsApp.
          </p>
          <div className="bb-rule mx-auto mt-6" style={{ maxWidth: 120 }} />
        </section>
      )}

      <section className="mx-auto max-w-container px-6 pb-16" style={{ paddingTop: showHero ? 0 : '2.5rem' }}>
        {categories.length > 0 && !query.trim() && (
          <div className="mb-6">
            <CategoryFilter categories={categories} selected={selectedCategory} onChange={setSelectedCategory} />
          </div>
        )}

        {query.trim() && (
          <p className="mb-6 font-sans text-sm text-muted">
            Resultados para <span className="text-gold-text">“{query.trim()}”</span>
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg bg-card" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="aspect-[3/4] animate-pulse bg-sunken" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-sunken" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-sunken" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-12 text-center font-sans text-danger">Erro ao carregar produtos. Tente novamente.</p>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <p className="mt-12 text-center font-sans text-faint">Nenhum produto encontrado.</p>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
