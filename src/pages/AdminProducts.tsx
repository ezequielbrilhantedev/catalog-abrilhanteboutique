import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X, LogOut, Tag } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCategories } from '../hooks/useCategories'
import type { Product } from '../types'
import { Button } from '../components/ui/Button'
import { IconButton } from '../components/ui/IconButton'
import { Badge } from '../components/ui/Badge'
import { PriceTag } from '../components/ui/PriceTag'

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Preço deve ser maior que zero'),
  original_price: z
    .string()
    .optional()
    .refine((v) => !v || Number(v.replace(',', '.')) > 0, 'Preço “de” inválido'),
  badge: z.string().optional(),
  category_id: z.string().optional(),
  active: z.boolean().default(true),
})

type FormInput = z.input<typeof schema>
type FormData = z.output<typeof schema>

const fieldClass =
  'w-full rounded-md border border-soft bg-card px-4 py-3 font-sans text-sm text-strong outline-none transition focus:border-gold-500 focus:shadow-[0_0_0_3px_var(--ring-focus)]'
const labelClass = 'font-sans text-xs font-medium uppercase text-muted'
const labelStyle = { letterSpacing: 'var(--ls-wide)' } as const

export function AdminProducts() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: categories = [] } = useCategories()

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(id, name, slug, display_order)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Product[]
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormData>({ resolver: zodResolver(schema) })

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert([payload])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      closeForm()
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('products').update({ active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const openCreate = () => {
    setEditingProduct(null)
    setPendingImageUrl(null)
    reset({ name: '', description: '', price: 0, original_price: '', badge: '', category_id: '', active: true })
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setPendingImageUrl(null)
    reset({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      original_price: product.original_price != null ? String(product.original_price) : '',
      badge: product.badge ?? '',
      category_id: product.category_id ?? '',
      active: product.active,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setPendingImageUrl(null)
    reset()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      setPendingImageUrl(data.publicUrl)
    }
    setUploadingImage(false)
  }

  const onSubmit = async (data: FormData) => {
    const original = data.original_price ? Number(data.original_price.replace(',', '.')) : null
    await saveMutation.mutateAsync({
      name: data.name.trim(),
      description: data.description?.trim() || null,
      price: data.price,
      original_price: original,
      badge: data.badge?.trim() || null,
      category_id: data.category_id || null,
      active: data.active,
      image_url: pendingImageUrl ?? editingProduct?.image_url ?? null,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const previewImage = pendingImageUrl ?? editingProduct?.image_url ?? null

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-container px-6 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="bb-eyebrow text-xs">Painel administrativo</div>
            <h1 className="mt-2 font-display text-3xl font-semibold text-strong">Produtos</h1>
            <p className="mt-1 font-sans text-sm text-faint">{products.length} produtos cadastrados</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/categorias"
              className="inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-gold-text"
            >
              <Tag size={16} />
              Categorias
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut size={16} />
              Sair
            </Button>
            <Button variant="primary" onClick={openCreate}>
              <Plus size={16} />
              Novo produto
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-base" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-soft bg-card">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-base text-left">
                  {['Produto', 'Categoria', 'Preço', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-engrave uppercase text-faint"
                      style={{ fontSize: '0.6875rem', letterSpacing: 'var(--ls-label)', fontWeight: 500 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-soft">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 flex-shrink-0 place-items-center overflow-hidden rounded-md bg-sunken text-gold-700">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span style={{ fontSize: 16 }}>◈</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm font-medium text-strong">{product.name}</span>
                          {product.badge && <Badge tone="gold">{product.badge}</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-muted">{product.categories?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <PriceTag value={product.price} original={product.original_price} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActiveMutation.mutate({ id: product.id, active: !product.active })}
                        aria-label={product.active ? 'Desativar produto' : 'Ativar produto'}
                      >
                        <Badge tone={product.active ? 'active' : 'inactive'}>{product.active ? 'Ativo' : 'Inativo'}</Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openEdit(product)} className="grid h-[30px] w-[30px] place-items-center rounded-md border border-soft text-muted transition hover:text-gold-text" aria-label="Editar">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Excluir este produto?')) deleteMutation.mutate(product.id)
                          }}
                          className="grid h-[30px] w-[30px] place-items-center rounded-md border border-soft text-muted transition hover:text-danger"
                          aria-label="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(36,31,24,0.45)' }} onClick={closeForm} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="max-h-[90vh] w-full overflow-y-auto rounded-xl border border-soft bg-card shadow-lg" style={{ maxWidth: 560 }}>
              <div className="flex items-center justify-between border-b border-soft px-6 py-5">
                <div>
                  <span className="bb-eyebrow mb-1 block text-xs">{editingProduct ? 'Editar' : 'Cadastro'}</span>
                  <h2 className="font-display text-2xl font-semibold text-strong">
                    {editingProduct ? 'Editar produto' : 'Novo produto'}
                  </h2>
                </div>
                <IconButton variant="ghost" size="sm" ariaLabel="Fechar" onClick={closeForm}>
                  <X size={18} />
                </IconButton>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass} style={labelStyle}>Nome *</label>
                  <input {...register('name')} placeholder="Brincos Coração Folheado" className={fieldClass} />
                  {errors.name && <p className="font-sans text-xs text-danger">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass} style={labelStyle}>Descrição</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Conte uma história sobre a peça…"
                    className={`${fieldClass} resize-y`}
                    style={{ minHeight: 88 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} style={labelStyle}>Preço (R$) *</label>
                    <input {...register('price')} type="number" step="0.01" min="0" placeholder="0,00" className={fieldClass} />
                    {errors.price && <p className="font-sans text-xs text-danger">{errors.price.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} style={labelStyle}>Preço “de” (promoção)</label>
                    <input {...register('original_price')} type="number" step="0.01" min="0" placeholder="opcional" className={fieldClass} />
                    {errors.original_price && <p className="font-sans text-xs text-danger">{errors.original_price.message as string}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} style={labelStyle}>Categoria</label>
                    <select {...register('category_id')} className={fieldClass}>
                      <option value="">Sem categoria</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} style={labelStyle}>Selo</label>
                    <input {...register('badge')} placeholder="Novo, Promo…" className={fieldClass} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass} style={labelStyle}>Foto</label>
                  <div className="flex items-center gap-4">
                    <div className="grid h-[88px] w-[88px] flex-shrink-0 place-items-center overflow-hidden rounded-md border border-soft bg-sunken text-gold-700">
                      {previewImage ? (
                        <img src={previewImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span style={{ fontSize: 28 }}>◈</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploadingImage}>
                        {uploadingImage ? 'Enviando…' : previewImage ? 'Trocar foto' : 'Enviar foto'}
                      </Button>
                      {pendingImageUrl && (
                        <button type="button" onClick={() => setPendingImageUrl(null)} className="text-left font-sans text-xs text-faint">
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <ActiveToggle register={register} checked={watch('active') ?? true} />

                <div className="mt-2 flex gap-3">
                  <Button variant="secondary" size="md" block type="button" onClick={closeForm}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="md" block type="submit" disabled={isSubmitting || uploadingImage}>
                    {isSubmitting ? 'Salvando…' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ActiveToggle({
  register,
  checked,
}: {
  register: ReturnType<typeof useForm<FormInput, unknown, FormData>>['register']
  checked: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md border border-soft bg-base px-4 py-3">
      <input {...register('active')} type="checkbox" className="sr-only" />
      <span
        className="relative inline-block h-[22px] w-[38px] flex-shrink-0 rounded-full border"
        style={{
          background: checked ? 'var(--gold-sheen)' : 'var(--white-300)',
          borderColor: checked ? 'transparent' : 'var(--border-soft)',
          transition: 'background var(--dur-fast) var(--ease-out)',
        }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
          style={{ left: checked ? 18 : 2, transition: 'left var(--dur-fast) var(--ease-out)' }}
        />
      </span>
      <span className="flex flex-col">
        <span className="font-sans text-sm font-medium text-strong">Produto ativo</span>
        <span className="font-sans text-xs text-faint">Visível na vitrine</span>
      </span>
    </label>
  )
}
