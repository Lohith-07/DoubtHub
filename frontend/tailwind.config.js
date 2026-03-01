/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f4f0',
          100: '#eae8e1',
          200: '#d4d0c5',
          300: '#b8b2a0',
          400: '#9a9280',
          500: '#7d7465',
          600: '#635c50',
          700: '#4e4840',
          800: '#3a3530',
          900: '#1e1c19',
          950: '#0f0e0c',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ece3',
          200: '#c2d9c2',
          300: '#97be97',
          400: '#679d67',
          500: '#4a7c4a',
          600: '#3a6239',
          700: '#2f4f2e',
          800: '#263e25',
          900: '#1e311d',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(30,28,25,0.08), 0 4px 16px -2px rgba(30,28,25,0.06)',
        'card-hover': '0 4px 12px 0 rgba(30,28,25,0.12), 0 12px 32px -4px rgba(30,28,25,0.10)',
        'input': '0 1px 2px 0 rgba(30,28,25,0.06)',
        'btn': '0 2px 8px -1px rgba(30,28,25,0.20)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
