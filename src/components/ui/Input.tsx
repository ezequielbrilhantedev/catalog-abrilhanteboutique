import { useId, useState } from 'react'
import type { CSSProperties, InputHTMLAttributes } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'prefix'> {
  label?: string
  hint?: string
  error?: string
  prefix?: string
  style?: CSSProperties
}

/**
 * Brilhante Boutique — text field with gold focus ring.
 */
export function Input({ label, hint, error, prefix, id, style, ...rest }: Props) {
  const [focus, setFocus] = useState(false)
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: 'var(--ls-wide)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--surface-raised)',
          border: `1px solid ${error ? 'var(--danger-500)' : focus ? 'var(--gold-500)' : 'var(--border-soft)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0 1rem',
          height: 48,
          boxShadow: focus ? '0 0 0 3px var(--ring-focus)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
      >
        {prefix && (
          <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-strong)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            height: '100%',
          }}
          {...rest}
        />
      </div>
      {(error || hint) && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            color: error ? 'var(--danger-500)' : 'var(--text-faint)',
          }}
        >
          {error || hint}
        </span>
      )}
    </div>
  )
}
