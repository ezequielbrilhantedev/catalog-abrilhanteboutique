/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand semantic surfaces & text (reference CSS tokens)
        page: 'var(--bg-page)',
        base: 'var(--bg-base)',
        card: 'var(--surface-card)',
        sunken: 'var(--surface-sunken)',
        ink: 'var(--surface-ink)',
        strong: 'var(--text-strong)',
        body: 'var(--text-body)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        // Gold scale
        gold: {
          100: 'var(--gold-100)',
          200: 'var(--gold-200)',
          300: 'var(--gold-300)',
          400: 'var(--gold-400)',
          500: 'var(--gold-500)',
          600: 'var(--gold-600)',
          700: 'var(--gold-700)',
          800: 'var(--gold-800)',
          text: 'var(--text-gold)',
        },
        bordo: 'var(--bordo-500)',
        whats: {
          DEFAULT: 'var(--whats-500)',
          dark: 'var(--whats-600)',
        },
        danger: 'var(--danger-500)',
      },
      fontFamily: {
        engrave: ['Cinzel', 'Times New Roman', 'serif'],
        display: ['Cormorant Garamond', 'Times New Roman', 'serif'],
        sans: ['Jost', 'Helvetica Neue', 'Arial', 'sans-serif'],
        note: ['Special Elite', 'Courier New', 'monospace'],
      },
      borderColor: {
        hairline: 'var(--border-hairline)',
        soft: 'var(--border-soft)',
        goldline: 'var(--border-gold)',
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        gold: 'var(--shadow-gold)',
        glow: 'var(--glow-gold)',
      },
      maxWidth: {
        container: '1120px',
        narrow: '760px',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
    },
  },
  plugins: [],
}
