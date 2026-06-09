import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { AdminGuard } from './components/AdminGuard'
import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'

// Admin é code-split: react-hook-form + zod + telas de gestão saem do
// bundle crítico da vitrine (público), que é o caminho quente.
const AdminLogin = lazy(() => import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AdminProducts = lazy(() => import('./pages/AdminProducts').then((m) => ({ default: m.AdminProducts })))
const AdminCategories = lazy(() =>
  import('./pages/AdminCategories').then((m) => ({ default: m.AdminCategories }))
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
})

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-page">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Vitrine pública */}
          <Route
            path="/"
            element={
              <Layout>
                <Catalog />
              </Layout>
            }
          />
          <Route
            path="/produto/:id"
            element={
              <Layout>
                <ProductDetail />
              </Layout>
            }
          />

          {/* Admin (code-split) */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminGuard>
                  <AdminProducts />
                </AdminGuard>
              </Suspense>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminGuard>
                  <AdminCategories />
                </AdminGuard>
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
