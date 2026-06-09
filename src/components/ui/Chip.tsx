import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface Props {
  selected?: boolean
  onClick?: () => void
  style?: CSSProperties
  children: ReactNode
}

/**
 * Brilhante Boutique — category filter pill. Selected fills with gold sheen.
 */
export function Chip({ selected = false, onClick, style, children }: Props) {
  const [hover, setHover] = useState(false)

  const state: CSSProperties = selected
    ? { background: 'var(--gold-sheen)', color: 'var(--text-on-gold)', borderColor: 'transparent', fontWeight: 600 }
    : {
        background: 'transparent',
        color: hover ? 'var(--text-gold)' : 'var(--text-muted)',
        borderColor: hover ? 'var(--gold-500)' : 'var(--border-soft)',
        fontWeight: 500,
      }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flexShrink: 0,
        padding: '0 18px',
        height: 38,
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.75rem',
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all var(--dur-fast) var(--ease-out)',
        ...state,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
