import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react'
import { useCartStore } from '../store/cart'
import { WHATSAPP_NUMBER } from '../lib/config'

export function Cart() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0))

  const formatted = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const handleWhatsApp = () => {
    const lines = items.map(
      (i) => `• ${i.product.name} x${i.quantity} — ${formatted(i.product.price * i.quantity)}`
    )
    const message = [
      'Olá! Tenho interesse nos seguintes produtos:',
      '',
      ...lines,
      '',
      `*Total: ${formatted(total)}*`,
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Meu carrinho</h2>
          <button onClick={closeCart} className="p-1 hover:text-brand-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 mt-12">Seu carrinho está vazio</p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                  <p className="text-brand-600 font-semibold text-sm mt-0.5">
                    {formatted(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border flex items-center justify-center hover:border-brand-400 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border flex items-center justify-center hover:border-brand-400 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-brand-600">{formatted(total)}</span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={20} />
              Finalizar pelo WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  )
}
