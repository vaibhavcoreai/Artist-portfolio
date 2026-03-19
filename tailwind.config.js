/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'near-black':   '#080608',
        'deep-charcoal':'#111014',
        'warm-ivory':   '#F2EDE4',
        'aged-gold':    '#B8956A',
        'muted-bronze': '#7A5C3A',
        'ghost-white':  '#FAF8F5',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"Jost"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':  ['96px',  { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'headline': ['48px',  { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'title':    ['32px',  { lineHeight: '1.2' }],
        'body':     ['16px',  { lineHeight: '1.7' }],
        'caption':  ['12px',  { lineHeight: '1.5', letterSpacing: '0.1em' }],
      },
      spacing: {
        '1':  '8px',
        '2':  '16px',
        '3':  '24px',
        '4':  '32px',
        '5':  '40px',
        '6':  '48px',
        '8':  '64px',
        '10': '80px',
        '12': '96px',
        '16': '128px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
