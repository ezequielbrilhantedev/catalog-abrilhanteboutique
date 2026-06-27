import type { ReactNode } from 'react';
import { Cart } from './Cart';
import { StoreHeader } from './StoreHeader';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-page">
      <StoreHeader />
      <main>{children}</main>
      <Footer />
      <Cart />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10 text-center">
      <div className="bb-diamond mb-3" />
      <p
        className="m-0 font-engrave text-xs uppercase text-faint"
        style={{ letterSpacing: 'var(--ls-label)' }}
      >
        Brilhante Boutique · @abrilhanteboutique
      </p>
      <p className="font-sans mt-2 text-sm">
        as semijoias certas para você brilhar ✨
      </p>
    </footer>
  );
}
