import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Sun, Moon, ChevronRight, ShieldCheck } from 'lucide-react';
import Sidebar, { NAV_GROUPS } from './components/Sidebar';
import Home from './modules/Home';
import Screener from './modules/ScreenerModule';
import Simulator from './modules/SimulatorModule';
import Zakat from './modules/ZakatModule';
import Portfolio from './modules/PortfolioModule';
import Academy from './modules/AcademyModule';
import Watchlist from './modules/WatchlistModule';
import Comparator from './modules/ComparatorModule';
import NewsModule from './modules/NewsModule';
import House from './modules/HouseModule';
import EtfXray from './modules/EtfXrayModule';
import ChartModule from './modules/ChartModule';
import LifestyleModule from './modules/LifestyleModule';
import IhsanDataModule from './modules/IhsanDataModule';

const PAGE_TITLES = Object.fromEntries(NAV_GROUPS.flatMap(group => group.items.map(item => [item.id, item.label])));
const PAGE_DESCRIPTIONS = {
  home: 'Une vue claire sur vos outils et les marchés.',
  screener: 'Étudier les entreprises et leurs indicateurs de conformité.',
  chart: 'Explorer les cours et leur historique.',
  portfolio: 'Suivre et organiser votre patrimoine.',
  watchlist: 'Retrouver les actifs que vous suivez.',
  comparator: 'Comparer les entreprises sur des critères communs.',
  etf: 'Examiner la composition des fonds indiciels.',
  simulator: 'Modéliser vos scénarios d’investissement.',
  zakat: 'Estimer votre zakat en toute transparence.',
  academy: 'Comprendre les fondamentaux de l’investissement.',
  house: 'Comparer des projets immobiliers et financiers.',
  lifestyle: 'Transformer vos objectifs en simulations.',
  'ihsan-data': 'Prendre du recul et cultiver la réflexion.',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [screenerTicker, setScreenerTicker] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try { return localStorage.getItem('athar-theme') === 'dark'; }
    catch { return false; }
  });
  const mainRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try { localStorage.setItem('athar-theme', isDarkMode ? 'dark' : 'light'); }
    catch { /* Storage may be disabled. */ }
  }, [isDarkMode]);

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileOpen(false);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const analyzeFromWatchlist = (ticker) => {
    setScreenerTicker(ticker || null);
    navigate('screener');
  };

  return (
    <div className="athar-shell flex h-screen min-h-[560px] overflow-hidden">
      <aside className={`athar-sidebar fixed inset-y-0 left-0 z-40 w-[264px] transition-transform duration-300 lg:relative lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeTab={currentPage} onNavigate={navigate} />
      </aside>
      {mobileOpen && <button aria-label="Fermer la navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="athar-topbar flex h-[74px] shrink-0 items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button className="athar-icon-button lg:hidden" aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <span className="hidden text-xs font-medium text-slate-400 sm:inline">Espace personnel</span>
            <ChevronRight size={14} className="hidden text-slate-300 sm:inline" />
            <span className="truncate text-sm font-semibold text-brand-dark dark:text-slate-100">{PAGE_TITLES[currentPage] || 'Tableau de bord'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-400 md:flex"><ShieldCheck size={15} /> Finance & éthique</span>
            <span className="hidden h-5 w-px bg-slate-200 dark:bg-white/10 md:block" />
            <button className="athar-icon-button" onClick={() => setIsDarkMode(v => !v)} aria-label={isDarkMode ? 'Activer le thème clair' : 'Activer le thème sombre'} title={isDarkMode ? 'Thème clair' : 'Thème sombre'}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main ref={mainRef} id="main-content" className="min-w-0 flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-7 sm:px-7 lg:px-10 lg:pt-10">
            <div className="animate-fade-in" key={currentPage}>
              {currentPage === 'home' && <Home onNavigate={navigate} />}
              {currentPage === 'screener' && <div className="space-y-12"><Screener autoSearch={screenerTicker} /><section className="border-t border-slate-200 pt-9 dark:border-white/10"><NewsModule /></section></div>}
              {currentPage === 'comparator' && <Comparator />}
              {currentPage === 'simulator' && <Simulator />}
              {currentPage === 'zakat' && <Zakat />}
              {currentPage === 'portfolio' && <Portfolio />}
              {currentPage === 'academy' && <Academy />}
              {currentPage === 'watchlist' && <Watchlist onAnalyze={analyzeFromWatchlist} />}
              {currentPage === 'house' && <House />}
              {currentPage === 'etf' && <EtfXray />}
              {currentPage === 'chart' && <ChartModule />}
              {currentPage === 'lifestyle' && <LifestyleModule />}
              {currentPage === 'ihsan-data' && <IhsanDataModule />}
            </div>
            <footer className="mt-16 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 py-6 text-xs text-slate-400 dark:border-white/10">
              <span>© {new Date().getFullYear()} Athar Finance</span>
              <span>Informations éducatives · Pas de conseil en investissement</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
