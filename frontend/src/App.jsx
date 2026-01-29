import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Imports icônes UI
import Sidebar from './components/Sidebar'; // 👇 On importe le nouveau fichier

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

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleWatchlistAnalyze = (ticker) => {
    setScreenerTicker(ticker);
    handleNavigate('screener');
  };

  return (
    // FOND GLOBAL : Noir "Private Banking"
    <div className="flex h-screen overflow-hidden bg-brand-dark text-white font-sans selection:bg-brand-gold/30 selection:text-brand-gold">
      
      {/* --- HEADER MOBILE (Navbar du haut) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded bg-gradient-gold flex items-center justify-center shadow-glow">
                 <span className="text-brand-dark font-display font-bold text-sm">A</span>
             </div>
             <span className="font-display font-bold text-white tracking-widest text-sm">ATHAR</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-brand-gold hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR RESPONSIVE --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-brand-dark border-r border-white/5 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:relative lg:translate-x-0
      `}>
        {/* On appelle notre nouveau composant ici ! */}
        <Sidebar 
            activeTab={currentPage} 
            onNavigate={handleNavigate} 
            isMobile={true} 
            closeMobileMenu={() => setIsMobileMenuOpen(false)} 
        />
      </aside>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"></div>
      )}

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto relative w-full pt-20 lg:pt-0 bg-brand-paper">
        <div className="max-w-7xl mx-auto p-4 lg:p-10 min-h-screen">
          
          {/* Header de Page (Dynamique) */}
          {currentPage !== 'home' && (
             <header className="mb-8 animate-fade-in border-b border-white/5 pb-6">
                <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                  {/* Petit point or décoratif */}
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-glow"></span>
                  {currentPage === 'screener' && 'Screener Pro'}
                  {currentPage === 'simulator' && 'Projections'}
                  {currentPage === 'watchlist' && 'Watchlist'}
                  {currentPage === 'comparator' && 'Comparateur'}
                  {currentPage === 'zakat' && 'Purification'}
                  {currentPage === 'portfolio' && 'Portefeuille'}
                  {currentPage === 'academy' && 'Académie'}
                </h2>
                <p className="text-gray-400 text-sm font-light pl-5">Gérez vos actifs avec précision et éthique.</p>
             </header>
          )}

          {/* Injection des Modules */}
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

          <footer className="mt-20 py-8 text-center border-t border-white/5">
             <p className="text-brand-muted text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors cursor-default">
               Athar Private Finance • v2.1 Pro
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;