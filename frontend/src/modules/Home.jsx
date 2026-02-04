import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ShieldCheck, TrendingUp, BookOpen, 
  RefreshCw, TrendingDown, Quote, ChevronRight, ChevronLeft 
} from 'lucide-react';

// Import des données Ihsan
import { WISDOMS } from './ihsanData';

const API_URL = 'https://athar-api.onrender.com/api'; 

export default function Home({ onNavigate }) {
  // --- ÉTATS MARCHÉ ---
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- ÉTATS ATHAR DU JOUR (CARROUSEL) ---
  const [atharIndex, setAtharIndex] = useState(0);
  const currentAthar = WISDOMS[atharIndex];

  // Cycle de vie : Chargement Marché + Rotation Athar
  useEffect(() => {
    loadMarketData();
    const marketTimer = setInterval(loadMarketData, 60000); // Marché : 60s
    const atharTimer = setInterval(nextAthar, 10000); // Athar : 10s

    return () => {
      clearInterval(marketTimer);
      clearInterval(atharTimer);
    };
  }, [atharIndex]); // Dépendance atharIndex pour le reset du timer manuel

  const loadMarketData = async () => {
    try {
        const response = await fetch(`${API_URL}/market/live-prices`);
        const data = await response.json();
        if (Array.isArray(data)) {
           setMarketData(data);
           setError(false);
        } else {
           setError(true);
        }
    } catch (e) {
        console.error("Erreur marché", e);
        setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de navigation du carrousel
  const nextAthar = (e) => {
    if(e) e.stopPropagation(); // Empêche le clic sur la carte parent
    setAtharIndex((prev) => (prev + 1) % WISDOMS.length);
  };

  const prevAthar = (e) => {
    if(e) e.stopPropagation();
    setAtharIndex((prev) => (prev - 1 + WISDOMS.length) % WISDOMS.length);
  };

  return (
    <div className="space-y-10 font-sans pb-20 animate-fade-in">
      
      {/* 1. HERO BANNER (DASHBOARD) */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-2xl transition-colors duration-300">
        
        {/* Fond décoratif subtil */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-stretch justify-between gap-12">
            
            {/* GAUCHE : TEXTE & CTA */}
            <div className="flex-1 space-y-8 flex flex-col justify-center">
                <div>
                  <span className="inline-block py-1.5 px-4 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand-gold/20">
                      Tableau de Bord
                  </span>
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                      L'Éthique rencontre <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-500">la Performance.</span>
                  </h1>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-lg border-l-4 border-brand-gold pl-6 italic font-serif">
                    "La richesse de l'âme est la seule vraie richesse."
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                    <button onClick={() => onNavigate('screener')} className="px-8 py-4 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-gold/20 hover:-translate-y-1 transition-all">
                        Scanner un Actif
                    </button>
                    <button onClick={() => onNavigate('portfolio')} className="px-8 py-4 bg-gray-50 text-gray-900 border border-gray-200 hover:bg-white dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 font-bold rounded-2xl transition-all">
                        Mon Portfolio
                    </button>
                </div>
            </div>
            
            {/* DROITE : COLONNE WIDGETS */}
            <div className="w-full lg:w-[360px] flex flex-col gap-6">
                
                {/* WIDGET 1 : ATHAR DU JOUR (CARROUSEL) */}
                <div 
                    onClick={() => onNavigate('ihsan-data')}
                    className="group relative bg-gradient-to-br from-[#fffbf0] to-white dark:from-[#1a1500] dark:to-[#121212] rounded-3xl p-6 border border-brand-gold/20 shadow-sm hover:shadow-xl hover:border-brand-gold/40 transition-all cursor-pointer overflow-hidden min-h-[180px] flex flex-col justify-between"
                >
                    {/* Header Widget */}
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-2">
                           <Quote size={12} className="fill-brand-gold" /> Athar du Jour
                        </span>
                        {/* Contrôles navigation */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={prevAthar} className="p-1 hover:bg-brand-gold/10 rounded-full text-gray-400 hover:text-brand-gold"><ChevronLeft size={14}/></button>
                            <button onClick={nextAthar} className="p-1 hover:bg-brand-gold/10 rounded-full text-gray-400 hover:text-brand-gold"><ChevronRight size={14}/></button>
                        </div>
                    </div>

                    {/* Contenu Sagesse */}
                    <div className="relative z-10 animate-fade-in" key={atharIndex}>
                        <p className="text-xl font-serif text-right text-gray-800 dark:text-gray-200 mb-2 leading-relaxed" dir="rtl">
                            {currentAthar.arabic}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic line-clamp-2">
                            « {currentAthar.french} »
                        </p>
                        <p className="text-[10px] text-brand-gold font-bold mt-2 uppercase tracking-wide text-right">
                           — {currentAthar.author}
                        </p>
                    </div>

                    {/* Décoration */}
                    <div className="absolute -bottom-6 -left-6 text-brand-gold/5">
                        <Quote size={80} />
                    </div>
                </div>

                {/* WIDGET 2 : MARCHÉS LIVE */}
                <div className="flex-1 bg-gray-50 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Marchés Sharia Live</p>
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></div>
                    </div>

                    {loading ? (
                       <div className="space-y-3">
                           {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse"></div>)}
                       </div>
                    ) : error ? (
                        <div className="text-center py-6">
                            <p className="text-xs text-gray-500 mb-2">Flux interrompu</p>
                            <button onClick={loadMarketData} className="px-3 py-1 bg-white dark:bg-white/10 rounded-full text-[10px] font-bold text-brand-gold border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors">
                                Réactualiser
                            </button>
                        </div>
                    ) : (
                       <div className="space-y-1">
                           {marketData.map(asset => (
                             <div key={asset.symbol} className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-white/5 last:border-0 group cursor-default">
                                <div>
                                    <p className="text-xs font-bold text-gray-800 dark:text-white group-hover:text-brand-gold transition-colors">{asset.name}</p>
                                    <p className="text-[9px] text-gray-400 font-mono">{asset.symbol}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-gray-900 dark:text-white font-bold">{asset.price.toLocaleString()} $</p>
                                    <p className={`text-[9px] font-bold flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {asset.change >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                                        {asset.change}%
                                    </p>
                                </div>
                             </div>
                           ))}
                       </div>
                    )}
                </div>

            </div>
        </div>
      </div>

      {/* 2. GRID OUTILS (Accès Rapide) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ToolCard title="Screener Pro" sub="Analyse Halal & Financière" icon={TrendingUp} onClick={() => onNavigate('screener')} delay="0ms" />
        <ToolCard title="Stock Battle" sub="Comparateur d'actifs" icon={ShieldCheck} onClick={() => onNavigate('comparator')} delay="100ms" />
        <ToolCard title="Lifestyle" sub="Objectifs de liberté" icon={ArrowUpRight} onClick={() => onNavigate('lifestyle')} delay="200ms" />
        <ToolCard title="Académie" sub="Comprendre la finance" icon={BookOpen} onClick={() => onNavigate('academy')} delay="300ms" />
      </div>
    </div>
  );
}

// Sous-Composant Carte Outil
function ToolCard({ title, sub, icon: Icon, onClick, delay }) {
    return (
        <div 
            onClick={onClick} 
            className="group p-6 rounded-3xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 hover:border-brand-gold/30 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl shadow-sm animate-fade-in-up"
            style={{animationDelay: delay}}
        >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300 mb-4 group-hover:scale-110 shadow-sm">
                <Icon size={22} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
        </div>
    )
}