/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCF7',
          100: '#FAF8F0',
          200: '#F4EFE0',
          300: '#E8DEC5',
          800: '#2C2723',
          900: '#1C1917',
        },
        ink: {
          DEFAULT: '#1E1B18',
          stamp: '#C23A22',
          blue: '#1E3A8A',
          green: '#14532D',
          purple: '#581C87',
        },
        obsidian: {
          DEFAULT: '#0B0D0E',
          card: '#121517',
          border: '#1F2428',
          subtle: '#2B3137',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        stamp: ['Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'stamp-press': 'stampPress 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'ripple': 'ripple 0.6s ease-out forwards',
        'subtle-pulse': 'subtlePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        stampPress: {
          '0%': { transform: 'scale(2.4) rotate(-15deg)', opacity: '0' },
          '70%': { transform: 'scale(0.92) rotate(var(--stamp-rot, -3deg))', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(var(--stamp-rot, -3deg))', opacity: '0.96' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
