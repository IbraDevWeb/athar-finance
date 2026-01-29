/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // 👈 C'est la ligne magique qui active le bouton manuel
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          dark: '#050505',       // Noir profond (Mode Sombre)
          paper: '#f8f9fa',      // Blanc cassé (Mode Clair - Fond)
          surface: '#ffffff',    // Blanc pur (Mode Clair - Cartes)
          gold: '#D4AF37',       // Or
          'gold-light': '#F3E5AB',
          muted: '#525252',
        }
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #AA8A29 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.15)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)', // Ombre douce pour le mode clair
      }
    },
  },
  plugins: [],
}