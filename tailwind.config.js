/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        pink: {
          50:  '#FFF5F8',
          100: '#FFE8EF',
          200: '#FFD1DF',
          300: '#FFB3C6',
          400: '#FF8FAD',
          500: '#FF6B93',
          600: '#E8476F',
          700: '#C42D54',
          800: '#9E1A3C',
          900: '#7A0E2A',
        },
        blush: '#FADADD',
        rose:  '#FFB6C1',
      },
    },
  },
  plugins: [],
}
