/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Manrope', 'sans-serif'] },
      colors: {
        brand: {
          dark: '#182635',
          paper: '#f5f7f9',
          surface: '#ffffff',
          gold: '#a78b5e',
          'gold-light': '#efe7d7',
          muted: '#627182',
        },
      },
      backgroundImage: { 'gradient-gold': 'linear-gradient(135deg, #bea471, #988058)' },
      boxShadow: { glow: '0 8px 24px rgba(167,139,94,.1)', soft: '0 4px 18px rgba(18,38,53,.05)' },
    },
  },
  plugins: [],
};
