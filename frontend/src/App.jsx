import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react'; 
import Sidebar from './components/Sidebar';

// Imports des Modules
import Home from "./modules/Home";
import Screener from "./modules/ScreenerModule";
import Simulator from "./modules/SimulatorModule";
import Zakat from "./modules/ZakatModule"; 
import Portfolio from "./modules/PortfolioModule";
import Academy from "./modules/AcademyModule";
import Watchlist from "./modules/WatchlistModule"; 
import Comparator from "./modules/ComparatorModule";
import NewsModule from "./modules/NewsModule";
import House from "./modules/HouseModule";
import EtfXray from "./modules/EtfXrayModule";
import ChartModule from './modules/ChartModule';
import LifestyleModule from './modules/LifestyleModule';
// NOUVEL IMPORT
import IhsanDataModule from './modules/IhsanDataModule';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [screenerTicker, setScreenerTicker] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleWatchlistAnalyze = (ticker) => {
    setScreenerTicker(ticker);
    handleNavigate('screener');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#f8f9fa] dark:bg-[#050505] transition-colors duration-300 text-gray-900 dark:text-white">
      
      {/* HEADER MOBILE */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#050505] border-b border-gray-200 dark:border-white/10 p-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center text-white shadow-lg">
                 <span className="font-display font-bold text-sm">A</span>
             </div>
             <span className="font-display font-bold text-gray-900 dark:text-white tracking-widest text-sm">ATHAR</span>
        </div>
        
        <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-brand-gold bg-brand-gold/10 rounded-lg hover:bg-brand-gold/20 transition-colors">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/5 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <Sidebar activeTab={currentPage} onNavigate={handleNavigate} isMobile={true} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      </aside>

      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"></div>}

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative w-full pt-20 lg:pt-0 scroll-smooth">
        <div className="max-w-7xl mx-auto p-4 lg:p-10 min-h-screen">
          
          <div className="hidden lg:flex justify-end mb-6">
             <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm">
                {isDarkMode ? <><Sun size={14} /> Mode Jour</> : <><Moon size={14} /> Mode Nuit</>}
             </button>
          </div>

          {currentPage !== 'home' && (
             <header className="mb-8 animate-fade-in border-b border-gray-200 dark:border-white/10 pb-6">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  {currentPage === 'screener' && 'Screener Pro'}
                  {currentPage === 'simulator' && 'Projections'}
                  {currentPage === 'watchlist' && 'Watchlist'}
                  {currentPage === 'comparator' && 'Comparateur'}
                  {currentPage === 'zakat' && 'Purification'}
                  {currentPage === 'portfolio' && 'Portefeuille'}
                  {currentPage === 'academy' && 'Académie'}
                  {currentPage === 'house' && 'Immobilier vs Bourse'}
                  {currentPage === 'etf' && 'Scanner ETF'}
                  {currentPage === 'chart' && 'Market Watch'}
                  {currentPage === 'lifestyle' && 'Lifestyle Converter'}
                  {/* TITRE IHSAN */}
                  {currentPage === 'ihsan-data' && 'Jardin des Vertueux'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light pl-5">Gérez vos actifs avec précision et éthique.</p>
             </header>
          )}

          <div className="animate-fade-in">
            {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
            
            {currentPage === 'screener' && (
                <div className="space-y-12">
                    <Screener autoSearch={screenerTicker} />
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent opacity-50"></div>
                    <section>
                        <div className="text-center mb-8"><h3 className="text-xl font-bold opacity-80 dark:text-white">Contexte de Marché</h3><p className="text-sm opacity-50 dark:text-gray-400">Comprendre pourquoi ça bouge</p></div>
                        <NewsModule />
                    </section>
                </div>
            )}
            
            {currentPage === 'comparator' && <Comparator />}
            {currentPage === 'simulator' && <Simulator />}
            {currentPage === 'zakat' && <Zakat />}
            {currentPage === 'portfolio' && <Portfolio />}
            {currentPage === 'academy' && <Academy />}
            {currentPage === 'watchlist' && <Watchlist onAnalyze={handleWatchlistAnalyze} />}
            {currentPage === 'house' && <House />}
            {currentPage === 'etf' && <EtfXray />}
            {currentPage === 'chart' && <ChartModule />}
            {currentPage === 'lifestyle' && <LifestyleModule />}
            
            {/* AFFICHAGE MODULE IHSAN */}
            {currentPage === 'ihsan-data' && <IhsanDataModule />}
          </div>

          <footer className="mt-20 py-8 text-center border-t border-gray-200 dark:border-white/5">
             <p className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors">Athar Private Finance • v2.6</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;