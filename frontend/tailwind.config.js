/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assure-toi d'importer cette police ou utilise system-ui
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          dark: '#050505',       // Noir quasi absolu (Luxe)
          paper: '#0a0a0a',      // Gris anthracite très sombre
          surface: '#121212',    // Pour les cartes
          gold: '#D4AF37',       // Or Métallique
          'gold-light': '#F3E5AB',
          muted: '#525252',
        }
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #AA8A29 100%)',
        'glass': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)',
        'glow-radial': 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}