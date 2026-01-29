import React from 'react';
import { 
  LayoutDashboard, Search, Wallet, BookOpen, 
  Scale, TrendingUp, Heart, Calculator, User 
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
            : 'text-gray-400 hover:text-white hover:bg-white/5'
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
        
        {/* Petite barre lumineuse à gauche si actif */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-gold rounded-full shadow-[0_0_10px_#D4AF37]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-brand-dark border-r border-white/5">
      
      {/* LOGO AREA */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow">
          <span className="text-brand-dark font-display font-bold text-xl">A</span>
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-white tracking-widest leading-none">
            ATHAR
          </h1>
          <p className="text-[9px] text-brand-gold uppercase tracking-[0.3em] mt-1">Private Finance</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar">
        <div className="px-6 mb-2 mt-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Général</span>
        </div>
        <NavItem id="home" icon={LayoutDashboard} label="Tableau de Bord" />
        <NavItem id="watchlist" icon={Heart} label="Watchlist" />

        <div className="px-6 mb-2 mt-6">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Marchés</span>
        </div>
        <NavItem id="screener" icon={Search} label="Screener Pro" />
        <NavItem id="comparator" icon={Scale} label="Comparateur" />

        <div className="px-6 mb-2 mt-6">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Patrimoine</span>
        </div>
        <NavItem id="portfolio" icon={Wallet} label="Mon Portefeuille" />
        <NavItem id="simulator" icon={TrendingUp} label="Projections" />
        <NavItem id="zakat" icon={Calculator} label="Zakat & Purif." />

        <div className="px-6 mb-2 mt-6">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Savoir</span>
        </div>
        <NavItem id="academy" icon={BookOpen} label="Académie" />
      </nav>

      {/* USER FOOTER */}
      <div className="p-4 border-t border-white/5 mx-4 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm group cursor-pointer hover:border-brand-gold/30 transition-colors">
            <div className="w-8 h-8 rounded-full bg-brand-surface border border-white/10 flex items-center justify-center text-xs text-brand-gold font-bold">
                <User size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-brand-gold transition-colors">Investisseur</p>
                <p className="text-[9px] text-emerald-500">● Connecté</p>
            </div>
        </div>
      </div>
    </div>
  );
}