import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cart'

export function CartButton() {
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const openCart = useCartStore((s) => s.openCart)

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-gray-700 hover:text-brand-600 transition-colors"
      aria-label="Abrir carrinho"
    >
      <ShoppingBag size={24} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
