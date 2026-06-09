import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'

const schema = z
  .object({
    password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'As senhas não coincidem',
    path: ['confirm'],
  })
type FormData = z.infer<typeof schema>

const fieldClass =
  'w-full rounded-md border border-soft bg-card px-4 py-3 font-sans text-sm text-strong outline-none transition focus:border-gold-500 focus:shadow-[0_0_0_3px_var(--ring-focus)]'

const labelClass = 'font-sans text-xs font-medium uppercase text-muted'

export function AdminResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState(false)

  // O Supabase detecta o token de recuperação na URL e dispara PASSWORD_RECOVERY,
  // estabelecendo uma sessão temporária que autoriza a troca de senha.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true)
      }
    })

    // Fallback: se já houver sessão (link processado antes do listener), libera.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    // Se em alguns segundos não houver sessão de recuperação, o link é inválido/expirado.
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) setInvalidLink(true)
      })
    }, 2500)

    return () => {
      data.subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (form: FormData) => {
    setServerError('')
    const { error } = await supabase.auth.updateUser({ password: form.password })
    if (error) {
      setServerError('Não foi possível atualizar a senha. Solicite um novo link.')
      return
    }
    setDone(true)
    setTimeout(() => navigate('/admin/produtos'), 1500)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-base px-6 py-10">
      <div className="w-full rounded-xl border border-soft bg-card p-8 shadow-md" style={{ maxWidth: 420 }}>
        <div className="mb-5 flex justify-center">
          <Logo layout="stack" size="md" />
        </div>

        {done ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-strong">Senha atualizada</h1>
            <p className="mt-3 font-sans text-sm text-body">Redirecionando para o painel…</p>
          </div>
        ) : invalidLink && !ready ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-strong">Link inválido ou expirado</h1>
            <p className="mt-3 font-sans text-sm text-body">
              Volte ao login e solicite um novo link de recuperação.
            </p>
            <a
              href="/admin"
              className="mt-6 inline-block font-sans text-sm text-muted transition-colors hover:text-gold-text"
            >
              ← Voltar ao login
            </a>
          </div>
        ) : !ready ? (
          <div className="grid place-items-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-semibold text-strong">Nova senha</h1>
              <p className="bb-eyebrow mt-2 text-xs">Defina sua nova senha de acesso</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className={labelClass} style={{ letterSpacing: 'var(--ls-wide)' }}>
                  Nova senha
                </label>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={fieldClass}
                />
                {errors.password && <p className="font-sans text-xs text-danger">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass} style={{ letterSpacing: 'var(--ls-wide)' }}>
                  Confirmar senha
                </label>
                <input
                  {...register('confirm')}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={fieldClass}
                />
                {errors.confirm && <p className="font-sans text-xs text-danger">{errors.confirm.message}</p>}
              </div>

              {serverError && <p className="text-center font-sans text-sm text-danger">{serverError}</p>}

              <Button type="submit" variant="primary" size="lg" block disabled={isSubmitting}>
                {isSubmitting ? 'Salvando…' : 'Salvar nova senha'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
