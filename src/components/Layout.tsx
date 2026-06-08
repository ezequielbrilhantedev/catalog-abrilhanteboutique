import { Link } from 'react-router-dom'
import { CartButton } from './CartButton'
import { Cart } from './Cart'

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tight text-brand-700">
            abboutique
          </Link>
          <CartButton />
        </div>
      </header>

      <main>{children}</main>

      <Cart />
    </div>
  )
}
