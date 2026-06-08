import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { AdminGuard } from './components/AdminGuard'
import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'
import { AdminLogin } from './pages/AdminLogin'
import { AdminProducts } from './pages/AdminProducts'
import { AdminCategories } from './pages/AdminCategories'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
})

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

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/produtos"
            element={
              <AdminGuard>
                <AdminProducts />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <AdminGuard>
                <AdminCategories />
              </AdminGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
