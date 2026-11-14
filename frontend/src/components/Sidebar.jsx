import React from 'react';
import { LayoutDashboard, Search, Wallet, BookOpen, Scale, TrendingUp, Heart, Calculator, House, Layers, ChartNoAxesCombined, ArrowLeftRight, Sprout } from 'lucide-react';

export const NAV_GROUPS = [
  { label: 'Vue générale', items: [
    { id: 'home', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'watchlist', label: 'Ma watchlist', icon: Heart },
    { id: 'portfolio', label: 'Portefeuille', icon: Wallet },
  ]},
  { label: 'Marchés & analyses', items: [
    { id: 'screener', label: 'Analyse des actifs', icon: Search },
    { id: 'chart', label: 'Cours & graphiques', icon: ChartNoAxesCombined },
    { id: 'comparator', label: 'Comparateur', icon: Scale },
    { id: 'etf', label: 'Analyse ETF', icon: Layers },
  ]},
  { label: 'Planification', items: [
    { id: 'simulator', label: 'Simulations', icon: TrendingUp },
    { id: 'house', label: 'Immobilier', icon: House },
    { id: 'lifestyle', label: 'Objectifs de vie', icon: ArrowLeftRight },
    { id: 'zakat', label: 'Calcul de la zakat', icon: Calculator },
  ]},
  { label: 'Apprendre', items: [
    { id: 'academy', label: 'Académie', icon: BookOpen },
    { id: 'ihsan-data', label: 'Jardin des vertueux', icon: Sprout },
  ]},
];

export default function Sidebar({ activeTab, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <button onClick={() => onNavigate('home')} className="flex items-center gap-3 px-7 pb-8 pt-8 text-left" aria-label="Athar Finance, accueil">
        <div className="athar-logo-mark flex h-10 w-10 items-center justify-center rounded-xl text-xl font-semibold">A</div>
        <div className="leading-tight">
          <strong className="block text-lg font-semibold tracking-[0.05em] text-white">athar<span className="text-[#c7ad79]">.</span></strong>
          <span className="text-[10px] font-medium tracking-[0.18em] text-slate-400 uppercase">Private finance</span>
        </div>
      </button>

      <nav aria-label="Navigation principale" className="min-h-0 flex-1 overflow-y-auto px-3 pb-8 custom-scrollbar">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => onNavigate(id)} aria-current={activeTab === id ? 'page' : undefined}
                  className={`athar-nav-item flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${activeTab === id ? 'is-active' : ''}`}>
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 px-6 py-5">
        <div className="text-xs font-semibold text-slate-200">Espace investisseur</div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Analyse et pédagogie financière.</p>
      </div>
    </div>
  );
}
