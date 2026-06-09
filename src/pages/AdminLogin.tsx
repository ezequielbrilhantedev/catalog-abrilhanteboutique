import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Logo from '../../public/brand/logo-nome.png';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});
type LoginData = z.infer<typeof loginSchema>;

const forgotSchema = z.object({
  email: z.string().email('E-mail inválido'),
});
type ForgotData = z.infer<typeof forgotSchema>;

const fieldClass =
  'w-full rounded-md border border-soft bg-card px-4 py-3 font-sans text-sm text-strong outline-none transition focus:border-gold-500 focus:shadow-[0_0_0_3px_var(--ring-focus)]';

const labelClass =
  'font-sans text-xs font-medium uppercase text-muted';

export function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'forgot'>(
    'login',
  );

  return (
    <div className="grid min-h-screen place-items-center bg-base px-6 py-10">
      <div
        className="w-full rounded-xl border border-soft bg-card p-8 shadow-md"
        style={{ maxWidth: 420 }}
      >
        <div className="mb-5 flex justify-center">
          <img
            src={Logo}
            alt="Brilhante Boutique"
            style={{ height: 91 }}
          />
        </div>

        {mode === 'login' ? (
          <LoginForm
            onForgot={() => setMode('forgot')}
            onSuccess={() => navigate('/admin/produtos')}
          />
        ) : (
          <ForgotForm onBack={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

function LoginForm({
  onForgot,
  onSuccess,
}: {
  onForgot: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setServerError('');
    const { error } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
    if (error) {
      setServerError('E-mail ou senha incorretos.');
      return;
    }
    onSuccess();
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-strong">
          Painel admin
        </h1>
        <p className="bb-eyebrow mt-2 text-xs">
          Acesso restrito
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label
            className={labelClass}
            style={{ letterSpacing: 'var(--ls-wide)' }}
          >
            E-mail
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            className={fieldClass}
          />
          {errors.email && (
            <p className="font-sans text-xs text-danger">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            className={labelClass}
            style={{ letterSpacing: 'var(--ls-wide)' }}
          >
            Senha
          </label>
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={fieldClass}
          />
          {errors.password && (
            <p className="font-sans text-xs text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-center font-sans text-sm text-danger">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>

        <button
          type="button"
          onClick={onForgot}
          className="font-sans text-sm text-muted transition-colors hover:text-gold-text"
        >
          Esqueci minha senha
        </button>

        <a
          href="/"
          className="text-center font-sans text-sm text-muted hover:text-gold-text"
        >
          ← Voltar à vitrine
        </a>
      </form>
    </>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotData) => {
    setServerError('');
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/admin/redefinir-senha`,
        },
      );
    if (error) {
      setServerError(
        'Não foi possível enviar o link. Tente novamente.',
      );
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-strong">
          Verifique seu e-mail
        </h1>
        <p className="mt-3 font-sans text-sm text-body">
          Enviamos um link de recuperação para{' '}
          <strong className="text-strong">
            {getValues('email')}
          </strong>
          . Abra o e-mail e clique no link para definir uma
          nova senha.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 font-sans text-sm text-muted transition-colors hover:text-gold-text"
        >
          ← Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-strong">
          Recuperar senha
        </h1>
        <p className="bb-eyebrow mt-2 text-xs">
          Enviaremos um link por e-mail
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label
            className={labelClass}
            style={{ letterSpacing: 'var(--ls-wide)' }}
          >
            E-mail
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            className={fieldClass}
          />
          {errors.email && (
            <p className="font-sans text-xs text-danger">
              {errors.email.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-center font-sans text-sm text-danger">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Enviando…'
            : 'Enviar link de recuperação'}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="text-center font-sans text-sm text-muted transition-colors hover:text-gold-text"
        >
          ← Voltar ao login
        </button>
      </form>
    </>
  );
}
