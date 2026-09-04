import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        'card-hover': 'var(--color-card-hover)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        silver: 'var(--color-silver)',
        steel: 'var(--color-steel)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        icon: ['Material Symbols Outlined'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(10, 132, 255, 0.28)',
        'glow-cyan': '0 0 52px rgba(0, 212, 255, 0.22)',
        'inner-line': 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(42,54,72,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(42,54,72,.32) 1px, transparent 1px)',
        'radial-blue': 'radial-gradient(circle at 50% 0%, rgba(10,132,255,.34), transparent 34rem)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '.65' },
          '50%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3.2s ease-in-out infinite',
        ticker: 'ticker 24s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
