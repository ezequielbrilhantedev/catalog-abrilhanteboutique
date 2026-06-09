import type { CSSProperties } from 'react'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  layout?: 'stack' | 'inline'
  mark?: boolean
  style?: CSSProperties
}

/**
 * Brilhante Boutique — typographic wordmark.
 * Engraved "BRILHANTE / BOUTIQUE" with a gold gem mark. Self-contained.
 */
export function Logo({ size = 'md', layout = 'stack', mark = true, style }: Props) {
  const scale = { sm: 0.8, md: 1, lg: 1.4 }[size]

  const gem = (
    <span
      aria-hidden="true"
      className="bb-gold-text"
      style={{
        fontSize: `${22 * scale}px`,
        lineHeight: 1,
        filter: 'drop-shadow(0 0 6px rgba(208,169,87,0.25))',
      }}
    >
      ◈
    </span>
  )

  const brilhante = (
    <span
      className="bb-gold-text"
      style={{
        fontFamily: 'var(--font-engrave)',
        fontWeight: 600,
        fontSize: `${17 * scale}px`,
        letterSpacing: '0.12em',
        lineHeight: 1,
      }}
    >
      BRILHANTE
    </span>
  )

  const boutique = (
    <span
      style={{
        fontFamily: 'var(--font-engrave)',
        fontWeight: 400,
        fontSize: `${8.5 * scale}px`,
        letterSpacing: 'var(--ls-engrave)',
        color: 'var(--text-muted)',
        lineHeight: 1,
      }}
    >
      BOUTIQUE
    </span>
  )

  if (layout === 'inline') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: `${8 * scale}px`, ...style }}>
        {mark && gem}
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: `${6 * scale}px` }}>
          {brilhante}
          {boutique}
        </span>
      </span>
    )
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: `${4 * scale}px`,
        ...style,
      }}
    >
      {mark && gem}
      {brilhante}
      {boutique}
    </span>
  )
}
