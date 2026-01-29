/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // On force l'utilisation des polices qu'on vient d'importer
        sans: ['Inter', 'sans-serif'], 
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          dark: '#050505',
          paper: '#0a0a0a',
          surface: '#121212',
          gold: '#D4AF37',
          muted: '#525252',
        }
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #AA8A29 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.15)',
      }
    },
  },
  plugins: [],
}