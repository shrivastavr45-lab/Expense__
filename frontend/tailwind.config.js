/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'animate-fade-in', 'animate-slide-up', 'animate-slide-in',
    'animate-pulse-soft', 'animate-shimmer',
  ],
  theme: {
    extend: {
      colors: {
        cream:   { DEFAULT: '#0d0e15', dark: '#0a0b10' },
        surface: { DEFAULT: 'rgba(20, 22, 31, 0.65)', 2: 'rgba(35, 38, 53, 0.65)', 3: 'rgba(50, 55, 75, 0.65)' },
        accent:  {
          DEFAULT: '#6366F1',
          light:   'rgba(99, 102, 241, 0.15)',
          mid:     '#4F46E5',
          bright:  '#818CF8',
        },
        ink: { DEFAULT: '#F8FAFC', 2: '#E2E8F0', 3: '#CBD5E1', 4: '#94A3B8', 5: '#64748B' },
        border: { DEFAULT: 'rgba(255, 255, 255, 0.08)', strong: 'rgba(255, 255, 255, 0.15)' },
        income:  '#10B981',
        expense: '#F43F5E',
        warn:    '#F59E0B',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        xs:  '0 1px 2px rgba(15,28,26,0.05)',
        sm:  '0 1px 4px rgba(15,28,26,0.07), 0 1px 2px rgba(15,28,26,0.04)',
        md:  '0 4px 12px rgba(15,28,26,0.08), 0 1px 4px rgba(15,28,26,0.04)',
        lg:  '0 8px 24px rgba(15,28,26,0.10), 0 2px 8px rgba(15,28,26,0.05)',
        xl:  '0 16px 40px rgba(15,28,26,0.12), 0 4px 12px rgba(15,28,26,0.06)',
        glow:'0 0 0 3px rgba(26,60,52,0.12)',
      },
      animation: {
        'fade-in':    'fadeIn .2s ease-out',
        'slide-up':   'slideUp .25s ease-out',
        'slide-in':   'slideIn .25s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn:   { from: { opacity: 0, transform: 'translateX(-8px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
