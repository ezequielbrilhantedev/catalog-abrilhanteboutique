import { useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'
type Size = 'sm' | 'md' | 'lg'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: Variant
  size?: Size
  block?: boolean
  style?: CSSProperties
  children: ReactNode
}

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: '0 14px', height: 36, fontSize: 'var(--text-xs, 0.75rem)' },
  md: { padding: '0 22px', height: 46, fontSize: 'var(--text-sm, 0.875rem)' },
  lg: { padding: '0 30px', height: 54, fontSize: '1rem' },
}

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: {
    background: 'var(--gold-sheen)',
    color: 'var(--text-on-gold)',
    fontWeight: 600,
    boxShadow: 'var(--shadow-sm)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-gold)',
    borderColor: 'var(--border-gold)',
  },
  ghost: { background: 'transparent', color: 'var(--text-body)' },
  whatsapp: { background: 'var(--whats-500)', color: '#06210f', fontWeight: 600 },
}

/**
 * Brilhante Boutique — Button. Pill, uppercase, gold sheen primary.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  type = 'button',
  style,
  children,
  ...rest
}: Props) {
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const hoverStyle: CSSProperties =
    !disabled && hover
      ? {
          primary: { filter: 'brightness(1.06)' },
          secondary: {
            background: 'rgba(166,126,51,0.10)',
            color: 'var(--gold-700)',
            borderColor: 'var(--gold-500)',
          },
          ghost: { color: 'var(--text-gold)', background: 'rgba(138,102,32,0.07)' },
          whatsapp: { background: 'var(--whats-600)' },
        }[variant]
      : {}

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setActive(false)
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: block ? '100%' : 'auto',
        border: '1px solid transparent',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition:
          'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap',
        ...SIZES[size],
        ...VARIANTS[variant],
        ...hoverStyle,
        transform: active && !disabled ? 'scale(0.98)' : 'scale(1)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
