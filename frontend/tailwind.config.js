/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#c5a059',       // L'Or Athar
          'gold-light': '#e6cca0',
          dark: '#1a1c23',       // Le Bleu Nuit Profond
          'dark-lighter': '#252830',
          paper: '#f9f7f2',      // Le fond papier crème
          emerald: '#10b981',    // Pour les indicateurs "Positifs"
          red: '#ef4444',        // Pour les indicateurs "Négatifs"
        }
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', 'serif'], // Pour les titres
        display: ['Cinzel', 'serif'],            // Pour les grands titres
        sans: ['Inter', 'sans-serif'],           // Pour le texte
        arabic: ['Amiri', 'serif'],              // Pour les termes arabes
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}