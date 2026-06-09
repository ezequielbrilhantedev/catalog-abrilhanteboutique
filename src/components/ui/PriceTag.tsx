import type { CSSProperties } from 'react'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  value: number
  original?: number | null
  size?: Size
  style?: CSSProperties
}

const SIZES: Record<Size, string> = { sm: '1rem', md: '1.375rem', lg: '2.25rem' }

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

/**
 * Brilhante Boutique — BRL price in display serif. Optional struck `original`.
 */
export function PriceTag({ value, original, size = 'md', style }: Props) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.5rem', ...style }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: SIZES[size],
          color: 'var(--price)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {fmt(value)}
      </span>
      {original != null && original > value && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            color: 'var(--text-faint)',
            textDecoration: 'line-through',
          }}
        >
          {fmt(original)}
        </span>
      )}
    </span>
  )
}
