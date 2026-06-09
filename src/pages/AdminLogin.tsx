import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
})

type FormData = z.infer<typeof schema>

const fieldClass =
  'w-full rounded-md border border-soft bg-card px-4 py-3 font-sans text-sm text-strong outline-none transition focus:border-gold-500 focus:shadow-[0_0_0_3px_var(--ring-focus)]'

export function AdminLogin() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError('E-mail ou senha incorretos.')
      return
    }
    navigate('/admin/produtos')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-base px-6 py-10">
      <div
        className="w-full rounded-xl border border-soft bg-card p-8 shadow-md"
        style={{ maxWidth: 420 }}
      >
        <div className="mb-5 flex justify-center">
          <Logo layout="stack" size="md" />
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-strong">Painel admin</h1>
          <p className="bb-eyebrow mt-2 text-xs">Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-medium uppercase text-muted" style={{ letterSpacing: 'var(--ls-wide)' }}>
              E-mail
            </label>
            <input {...register('email')} type="email" autoComplete="email" placeholder="voce@exemplo.com" className={fieldClass} />
            {errors.email && <p className="font-sans text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-medium uppercase text-muted" style={{ letterSpacing: 'var(--ls-wide)' }}>
              Senha
            </label>
            <input {...register('password')} type="password" autoComplete="current-password" placeholder="••••••••" className={fieldClass} />
            {errors.password && <p className="font-sans text-xs text-danger">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-center font-sans text-sm text-danger">{serverError}</p>}

          <Button type="submit" variant="primary" size="lg" block disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>

          <a href="/" className="mt-1 text-center font-sans text-sm text-muted hover:text-gold-text">
            ← Voltar à vitrine
          </a>
        </form>
      </div>
    </div>
  )
}
