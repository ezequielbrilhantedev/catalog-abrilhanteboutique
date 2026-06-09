import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCategories } from '../hooks/useCategories'
import { Button } from '../components/ui/Button'

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
})

type FormData = z.infer<typeof schema>

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const fieldClass =
  'w-full rounded-md border border-soft bg-card px-4 py-3 font-sans text-sm text-strong outline-none transition focus:border-gold-500 focus:shadow-[0_0_0_3px_var(--ring-focus)]'

export function AdminCategories() {
  const queryClient = useQueryClient()
  const { data: categories = [] } = useCategories()
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase.from('categories').insert([
        { name: data.name, slug: toSlug(data.name), display_order: categories.length },
      ])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      reset()
      setShowForm(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-narrow px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/admin/produtos" className="text-muted transition-colors hover:text-gold-text" aria-label="Voltar aos produtos">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <div className="bb-eyebrow text-xs">Painel administrativo</div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-strong">Categorias</h1>
          </div>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Nova categoria
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-soft bg-card">
          {categories.length === 0 ? (
            <p className="py-10 text-center font-sans text-faint">Nenhuma categoria cadastrada.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {categories.map((cat, i) => (
                <li
                  key={cat.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={i > 0 ? { borderTop: '1px solid var(--border-soft)' } : undefined}
                >
                  <span className="font-sans font-medium text-strong">{cat.name}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir a categoria "${cat.name}"?`)) deleteMutation.mutate(cat.id)
                    }}
                    className="text-faint transition-colors hover:text-danger"
                    aria-label="Excluir categoria"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit((d) => createMutation.mutateAsync(d))}
            className="mt-4 flex gap-3 rounded-lg border border-soft bg-card p-4"
          >
            <div className="flex-1">
              <input {...register('name')} placeholder="Nome da categoria" autoFocus className={fieldClass} />
              {errors.name && <p className="mt-1 font-sans text-xs text-danger">{errors.name.message}</p>}
            </div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setShowForm(false)
                reset()
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
