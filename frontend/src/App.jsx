import React, { useState } from 'react';

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

  const handleWatchlistAnalyze = (ticker) => {
    setScreenerTicker(ticker);
    setCurrentPage('screener');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-brand-dark selection:bg-brand-gold selection:text-white">
      
      {/* 1. SIDEBAR (ATHAR STYLE) */}
      <aside className="w-20 lg:w-72 bg-brand-dark text-white flex-shrink-0 flex flex-col justify-between transition-all duration-300 shadow-2xl z-50 border-r border-brand-gold/10 relative overflow-hidden">
        
        {/* Motif de fond subtil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        {/* Logo Area */}
        <div className="p-8 flex items-center gap-4 cursor-pointer z-10" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 border border-brand-gold/40 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)] text-xl bg-brand-dark">
            ☪️
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display font-bold text-xl tracking-wider text-white">HALAL <span className="text-brand-gold">INVEST</span></h1>
            <p className="text-[9px] text-gray-400 font-sans uppercase tracking-[0.25em]">Éthique & Finance</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 z-10 scrollbar-thin">
          <MenuLabel label="Analyse" />
          <MenuItem active={currentPage === 'home'} onClick={() => setCurrentPage('home')} icon="🏠" label="Tableau de Bord" />
          <MenuItem active={currentPage === 'screener'} onClick={() => setCurrentPage('screener')} icon="🔍" label="Screener Pro" />
          <MenuItem active={currentPage === 'watchlist'} onClick={() => setCurrentPage('watchlist')} icon="❤️" label="Favoris" />
          <MenuItem active={currentPage === 'comparator'} onClick={() => setCurrentPage('comparator')} icon="⚖️" label="Comparateur" />
          
          <div className="my-6 border-t border-brand-gold/10 mx-4"></div>
          
          <MenuLabel label="Patrimoine" />
          <MenuItem active={currentPage === 'simulator'} onClick={() => setCurrentPage('simulator')} icon="🚀" label="Projection" />
          <MenuItem active={currentPage === 'portfolio'} onClick={() => setCurrentPage('portfolio')} icon="💼" label="Portfolio" />
          <MenuItem active={currentPage === 'zakat'} onClick={() => setCurrentPage('zakat')} icon="🤲" label="Zakat & Purif" />
          
          <div className="my-6 border-t border-brand-gold/10 mx-4"></div>
          
          <MenuLabel label="Savoir" />
          <MenuItem active={currentPage === 'academy'} onClick={() => setCurrentPage('academy')} icon="🎓" label="Académie" />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-brand-gold/10 bg-brand-dark-lighter/50 z-10">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition border border-transparent hover:border-brand-gold/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-gold to-[#e6cca0] flex items-center justify-center text-xs font-bold text-brand-dark shadow-lg">
              IB
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-serif font-bold text-white">Ibrahim</p>
              <p className="text-[10px] text-brand-gold uppercase tracking-wider">Membre Fondateur</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-brand-paper">
        
        {/* Header Mobile */}
        <div className="lg:hidden bg-brand-dark text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md border-b border-brand-gold/20">
           <span className="font-display font-bold text-brand-gold">HALAL INVEST</span>
           <span className="text-xs border border-brand-gold/30 px-2 py-1 rounded">Menu</span>
        </div>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-screen">
          {/* Header Page */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-brand-gold/20 pb-6">
             <div>
                <h2 className="text-4xl font-display font-bold text-brand-dark mb-2">
                  {currentPage === 'home' && 'Tableau de Bord'}
                  {currentPage === 'screener' && 'Screener Avancé'}
                  {currentPage === 'simulator' && 'Projection Future'}
                  {currentPage === 'watchlist' && 'Liste de Surveillance'}
                  {currentPage === 'comparator' && 'Duel Boursier'}
                  {currentPage === 'zakat' && 'Calcul de Zakat'}
                  {currentPage === 'portfolio' && 'Mon Portefeuille'}
                  {currentPage === 'academy' && 'Centre de Savoir'}
                </h2>
                <p className="text-gray-500 font-serif italic">"Investir dans ce bas-monde, pour récolter dans l'au-delà."</p>
             </div>
             
             {/* Indicateur Marché */}
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-gold/30 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                </span>
                <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">Marchés Ouverts</span>
             </div>
          </header>

          {/* Contenu */}
          <div className="animate-fade-in">
            {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
            {currentPage === 'screener' && <Screener autoSearch={screenerTicker} />} 
            {currentPage === 'comparator' && <Comparator />}
            {currentPage === 'simulator' && <Simulator />}
            {currentPage === 'zakat' && <Zakat />}
            {currentPage === 'portfolio' && <Portfolio />}
            {currentPage === 'academy' && <Academy />}
            {currentPage === 'watchlist' && <Watchlist onAnalyze={handleWatchlistAnalyze} />}
          </div>

          <footer className="mt-24 border-t border-brand-gold/10 pt-8 text-center">
             <p className="font-display font-bold text-brand-dark mb-2">HALAL INVEST</p>
             <p className="text-xs text-gray-400 font-sans">© 2026. Données financières à titre indicatif. Consultez un savant pour vos décisions.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

// Composants Menu Style Athar
function MenuItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
        active
          ? 'bg-gradient-to-r from-brand-gold/20 to-transparent text-brand-gold border-l-4 border-brand-gold'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`text-lg transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 text-gray-500 group-hover:text-brand-gold'}`}>{icon}</span>
      <span className={`font-sans text-sm tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}

function MenuLabel({ label }) {
  return (
    <div className="hidden lg:block px-4 mt-6 mb-3 text-[10px] font-bold text-brand-gold/50 uppercase tracking-[0.2em] font-sans">
      {label}
    </div>
  );
}

export default App;