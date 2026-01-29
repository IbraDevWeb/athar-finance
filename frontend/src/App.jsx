import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react'; // Ajout icônes Sun/Moon
import Sidebar from './components/Sidebar';

// Imports Modules
import Home from "./modules/Home";
import Screener from "./modules/ScreenerModule";
import Simulator from "./modules/SimulatorModule";
import Zakat from "./modules/ZakatModule"; 
import Portfolio from "./modules/PortfolioModule";
import Academy from "./modules/AcademyModule";
import Watchlist from "./modules/WatchlistModule"; 
import Comparator from "./modules/ComparatorModule";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [screenerTicker, setScreenerTicker] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- LOGIQUE DARK MODE ---
  const [isDarkMode, setIsDarkMode] = useState(false); // Faux par défaut = Mode Clair

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  // -------------------------

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleWatchlistAnalyze = (ticker) => {
    setScreenerTicker(ticker);
    handleNavigate('screener');
  };

  return (
    // La classe de base gère maintenant les deux modes via index.css
    <div className="flex h-screen overflow-hidden font-sans selection:bg-brand-gold/30 selection:text-brand-gold transition-colors duration-300">
      
      {/* --- HEADER MOBILE --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-brand-dark/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 p-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-gold flex items-center justify-center text-white shadow-glow">
                 <span className="font-display font-bold text-sm">A</span>
             </div>
             <span className="font-display font-bold text-brand-dark dark:text-white tracking-widest text-sm">ATHAR</span>
        </div>
        <div className="flex gap-2">
            {/* Bouton Thème Mobile */}
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-brand-gold bg-brand-gold/10 rounded-lg">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 
          bg-white dark:bg-brand-dark border-r border-gray-100 dark:border-white/5 
          transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:relative lg:translate-x-0
      `}>
        <Sidebar 
            activeTab={currentPage} 
            onNavigate={handleNavigate} 
            isMobile={true} 
            closeMobileMenu={() => setIsMobileMenuOpen(false)} 
        />
      </aside>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"></div>
      )}

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto relative w-full pt-20 lg:pt-0 bg-brand-paper dark:bg-black/95 transition-colors">
        <div className="max-w-7xl mx-auto p-4 lg:p-10 min-h-screen">
          
          {/* Header Desktop (Avec Bouton Thème) */}
          <div className="hidden lg:flex justify-end mb-4">
             <button 
                onClick={toggleTheme} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:border-brand-gold transition-all shadow-sm"
             >
                {isDarkMode ? <><Sun size={14} /> Mode Jour</> : <><Moon size={14} /> Mode Nuit</>}
             </button>
          </div>

          {/* Titre de Page */}
          {currentPage !== 'home' && (
             <header className="mb-8 animate-fade-in border-b border-gray-100 dark:border-white/5 pb-6">
                <h2 className="text-3xl font-display font-bold text-brand-dark dark:text-white mb-2 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  {currentPage === 'screener' && 'Screener Pro'}
                  {currentPage === 'simulator' && 'Projections'}
                  {currentPage === 'watchlist' && 'Watchlist'}
                  {currentPage === 'comparator' && 'Comparateur'}
                  {currentPage === 'zakat' && 'Purification'}
                  {currentPage === 'portfolio' && 'Portefeuille'}
                  {currentPage === 'academy' && 'Académie'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light pl-5">Gérez vos actifs avec précision et éthique.</p>
             </header>
          )}

          {/* Modules */}
          <div className="animate-fade-in">
            {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
            {currentPage === 'screener' && <Screener autoSearch={screenerTicker} />} 
            {currentPage === 'comparator' && <Comparator />}
            {currentPage === 'simulator' && <Simulator />}
            {currentPage === 'zakat' && <Zakat />}
            {currentPage === 'portfolio' && <Portfolio />}
            {currentPage === 'academy' && <Academy />}
            {currentPage === 'watchlist' && <Watchlist onAnalyze={handleWatchlistAnalyze} />}
          </div>

          <footer className="mt-20 py-8 text-center border-t border-gray-100 dark:border-white/5">
             <p className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors">
               Athar Private Finance • v2.2
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;