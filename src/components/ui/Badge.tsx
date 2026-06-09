import type { CSSProperties, ReactNode } from 'react'

type Tone = 'active' | 'inactive' | 'gold' | 'sale' | 'neutral'

interface Props {
  tone?: Tone
  style?: CSSProperties
  children: ReactNode
}

const TONES: Record<Tone, CSSProperties> = {
  active: { background: 'rgba(79,168,106,0.15)', color: '#2e7d4f', border: '1px solid rgba(79,168,106,0.40)' },
  inactive: { background: 'rgba(150,143,129,0.12)', color: 'var(--text-faint)', border: '1px solid var(--border-soft)' },
  gold: { background: 'rgba(196,162,80,0.16)', color: 'var(--gold-700)', border: '1px solid var(--border-gold)' },
  sale: { background: 'rgba(142,42,42,0.12)', color: '#9e3b36', border: '1px solid rgba(142,42,42,0.40)' },
  neutral: { background: 'var(--surface-raised)', color: 'var(--text-muted)', border: '1px solid var(--border-soft)' },
}

/**
 * Brilhante Boutique — small status / label pill.
 */
export function Badge({ tone = 'neutral', style, children }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '3px 10px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        lineHeight: 1,
        ...TONES[tone],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
