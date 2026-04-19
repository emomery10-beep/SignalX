/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-dm)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          950: '#04080f', 900: '#080f1e', 800: '#0d1a35', 700: '#14274d',
          600: '#1c3566', 500: '#264880', 400: '#3460a8', 300: '#5280cc',
          200: '#89aee0', 100: '#c2d5f0', 50:  '#eaf0fb',
        },
        signal: {
          600: '#0a9e96', 500: '#12b8af', 400: '#1ed4ca',
          300: '#47e2da', 200: '#85ede9', 100: '#bef6f3',
        },
        pulse: {
          700: '#4a1db8', 600: '#5f28e0', 500: '#7642f5',
          400: '#9268f8', 300: '#b49cfc', 200: '#d4c5fe',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(.16,1,.3,1) both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.4', transform: 'scale(.75)' } },
      },
    },
  },
  plugins: [],
}
