import { Minus, Plus, Trash2, MessageCircle, X } from 'lucide-react'
import { useCartStore } from '../store/cart'
import { WHATSAPP_NUMBER } from '../lib/config'
import { IconButton } from './ui/IconButton'
import { Button } from './ui/Button'
import { PriceTag } from './ui/PriceTag'

const fmt = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function Cart() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const total = useCartStore((s) => s.total())

  const handleWhatsApp = () => {
    const lines = items.map(
      (i) => `• ${i.product.name} x${i.quantity} — ${fmt(i.product.price * i.quantity)}`
    )
    const message = [
      'Olá! Tenho interesse nas seguintes semijoias:',
      '',
      ...lines,
      '',
      `*Total: ${fmt(total)}*`,
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(36,31,24,0.35)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity var(--dur-base) var(--ease-out)',
        }}
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full flex-col bg-card"
        style={{
          width: 'min(420px, 92vw)',
          borderLeft: '1px solid var(--border-hairline)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--dur-slow) var(--ease-out)',
          boxShadow: 'var(--shadow-lg)',
        }}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-soft p-6">
          <h2 className="bb-eyebrow text-sm">Meu carrinho</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar carrinho" onClick={closeCart}>
            <X size={18} />
          </IconButton>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="mt-12 text-center font-sans text-faint">Seu carrinho está vazio.</p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-md border border-soft bg-sunken">
                  {item.product.image_url && (
                    <img src={item.product.image_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate font-display text-base font-semibold text-strong">
                    {item.product.name}
                  </p>
                  <div className="mt-0.5">
                    <PriceTag value={item.product.price} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-pill border border-soft" style={{ padding: '2px 4px' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-gold-text"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center font-sans text-sm text-strong">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-gold-text"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-faint transition-colors hover:text-danger"
                      aria-label="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-soft p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-engrave text-xs uppercase text-muted" style={{ letterSpacing: 'var(--ls-label)' }}>
                Total
              </span>
              <span className="font-display text-2xl font-semibold" style={{ color: 'var(--text-gold)' }}>
                {fmt(total)}
              </span>
            </div>
            <Button variant="whatsapp" size="lg" block onClick={handleWhatsApp}>
              <MessageCircle size={20} />
              Finalizar pelo WhatsApp
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
