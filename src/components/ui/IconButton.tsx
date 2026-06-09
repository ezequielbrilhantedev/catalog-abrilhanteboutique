import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type Variant = 'ghost' | 'outline' | 'solid'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  size?: Size
  badge?: number
  disabled?: boolean
  ariaLabel?: string
  onClick?: () => void
  style?: CSSProperties
  children: ReactNode
}

const DIMS: Record<Size, number> = { sm: 36, md: 44, lg: 52 }

const VARIANTS: Record<Variant, CSSProperties> = {
  ghost: { background: 'transparent', color: 'var(--text-body)', border: '1px solid transparent' },
  outline: { background: 'transparent', color: 'var(--text-gold)', border: '1px solid var(--border-gold)' },
  solid: { background: 'var(--surface-raised)', color: 'var(--text-strong)', border: '1px solid var(--border-soft)' },
}

/**
 * Brilhante Boutique — circular icon-only control with optional count badge.
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  badge,
  disabled = false,
  ariaLabel,
  onClick,
  style,
  children,
}: Props) {
  const [hover, setHover] = useState(false)
  const dim = DIMS[size]

  const hoverStyle: CSSProperties =
    !disabled && hover
      ? {
          ghost: { background: 'rgba(138,102,32,0.07)', color: 'var(--text-gold)' },
          outline: { background: 'rgba(166,126,51,0.10)', borderColor: 'var(--gold-500)', color: 'var(--gold-700)' },
          solid: { background: 'var(--surface-hover)' },
        }[variant]
      : {}

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        width: dim,
        height: dim,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition:
          'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        ...VARIANTS[variant],
        ...hoverStyle,
        ...style,
      }}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className="bb-gold-fill"
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 19,
            height: 19,
            padding: '0 5px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: 'var(--radius-pill)',
            border: '2px solid var(--bg-page)',
          }}
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}
