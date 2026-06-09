import { Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useSearchStore } from '../store/search';
import { IconButton } from './ui/IconButton';
import { Logo } from './ui/Logo';

export function StoreHeader() {
  const navigate = useNavigate();
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);

  const searchOpen = useSearchStore((s) => s.isOpen);
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const toggleSearch = useSearchStore((s) => s.toggle);
  const closeSearch = useSearchStore((s) => s.close);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearchToggle = () => {
    // Buscar só faz sentido na vitrine — leva para lá ao abrir.
    if (!searchOpen) navigate('/');
    toggleSearch();
  };

  return (
    <header
      className="sticky top-0 z-30 border-b border-hairline"
      style={{
        height: 'var(--header-h)',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-container items-center justify-between gap-4 px-6">
        <Link
          to="/"
          aria-label="Brilhante Boutique — início"
        >
          <Logo layout="inline" size="md" />
        </Link>

        <div className="flex items-center gap-2">
          {searchOpen && (
            <div
              className="flex items-center gap-2 rounded-pill border border-soft bg-card px-4"
              style={{ height: 40 }}
            >
              <Search size={16} className="text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Escape' && closeSearch()
                }
                placeholder="Buscar semijoias…"
                className="w-32 bg-transparent text-sm text-strong outline-none placeholder:text-faint sm:w-48"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
          )}

          {/* Desktop: texto; mobile: ícone */}
          <Link
            to="/admin"
            className="mr-1 font-engrave text-faint uppercase sm:inline"
            style={{
              fontSize: '0.6875rem',
              letterSpacing: 'var(--ls-label)',
            }}
          >
            Admin
          </Link>

          <IconButton
            variant="ghost"
            ariaLabel={
              searchOpen ? 'Fechar busca' : 'Buscar'
            }
            onClick={handleSearchToggle}
          >
            {searchOpen ? (
              <X size={20} />
            ) : (
              <Search size={20} />
            )}
          </IconButton>

          <IconButton
            variant="ghost"
            ariaLabel="Abrir carrinho"
            badge={count}
            onClick={openCart}
          >
            <ShoppingBag size={20} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
