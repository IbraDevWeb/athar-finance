import React from 'react';
// [NOUVEAU] Ajout de l'icône Activity pour le Market Watch
import { 
  LayoutDashboard, Search, Wallet, BookOpen, 
  Scale, TrendingUp, Heart, Calculator, User, Home, Layers, Activity 
} from 'lucide-react';

export default function Sidebar({ activeTab, onNavigate, isMobile, closeMobileMenu }) {
  
  const NavItem = ({ id, icon: Icon, label }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => {
          onNavigate(id);
          if (isMobile) closeMobileMenu();
        }}
        className={`w-full flex items-center gap-4 px-5 py-3.5 transition-all duration-300 group relative rounded-xl mx-2 my-1
          ${isActive 
            ? 'bg-brand-gold/10 text-brand-gold' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-brand-dark dark:hover:text-white'
          } ${isMobile ? 'max-w-[90%]' : 'w-[90%]'}`}
      >
        <Icon 
          size={20} 
          className={`transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} 
          strokeWidth={isActive ? 2.5 : 1.5}
        />
        <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-gold rounded-full"></div>
        )}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-brand-dark transition-colors duration-300">
      
      {/* LOGO */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center text-white shadow-glow">
          <span className="font-display font-bold text-xl">A</span>
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-brand-dark dark:text-white tracking-widest leading-none">
            ATHAR
          </h1>
          <p className="text-[9px] text-brand-gold uppercase tracking-[0.3em] mt-1">Private Finance</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar">
        <MenuSection label="Général" />
        <NavItem id="home" icon={LayoutDashboard} label="Tableau de Bord" />
        <NavItem id="watchlist" icon={Heart} label="Watchlist" />

        <MenuSection label="Marchés" />
        <NavItem id="screener" icon={Search} label="Screener Pro" />
        <NavItem id="etf" icon={Layers} label="ETF X-Ray" />
        {/* [NOUVEAU] Market Watch ajouté ici sans casser le reste */}
        <NavItem id="chart" icon={Activity} label="Market Watch" />
        <NavItem id="comparator" icon={Scale} label="Comparateur Actions" />

        <MenuSection label="Patrimoine" />
        <NavItem id="portfolio" icon={Wallet} label="Mon Portefeuille" />
        <NavItem id="simulator" icon={TrendingUp} label="Projections" />
        <NavItem id="house" icon={Home} label="Acheter vs Louer" />
        <NavItem id="zakat" icon={Calculator} label="Zakat & Purif." />

        <MenuSection label="Savoir" />
        <NavItem id="academy" icon={BookOpen} label="Académie" />
      </nav>

      {/* FOOTER (Identique à ton ancien fichier) */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5 mx-4 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-brand-gold/30 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-xs text-brand-gold font-bold shadow-sm">
                <User size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 dark:text-white truncate">Investisseur</p>
                <p className="text-[9px] text-emerald-500">● Connecté</p>
            </div>
        </div>
      </div>
    </div>
  );
}

const MenuSection = ({ label }) => (
    <div className="px-6 mb-2 mt-6">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">{label}</span>
    </div>
);