import React, { useState, useEffect } from 'react';

const API_URL = 'https://athar-api.onrender.com';

export default function Home({ onNavigate }) {
  const [portfolioSummary, setPortfolioSummary] = useState({ total: 0, count: 0 });
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  const QUOTES = [
      "La meilleure richesse est la richesse de l'âme.",
      "Investir dans ce bas-monde, pour récolter dans l'au-delà.",
      "Ne pas manger son capital est le début de la fortune.",
      "Le commerce sincère est béni par Allah ﷻ.",
      "La patience est la clé de la réussite boursière."
  ];
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const savedPortfolio = JSON.parse(localStorage.getItem('myPortfolio')) || [];
    try {
        const indices = ["BTC-USD", "GC=F", "SPUS"]; 
        const response = await fetch(`${API_URL}/screening/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: indices.join(',') })
        });
        const data = await response.json();
        if (data.success) setMarketData(data.results);
    } catch (e) {
        console.error("Erreur marché", e);
    }
    const totalBuy = savedPortfolio.reduce((acc, item) => acc + (item.qty * item.buyPrice), 0);
    setPortfolioSummary({ total: totalBuy, count: savedPortfolio.length });
    const savedWatchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    setWatchlistCount(savedWatchlist.length);
    setLoading(false);
  };

  const formatMoney = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* BANNER PRINCIPALE */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-dark text-white p-6 md:p-12 shadow-2xl border border-brand-gold/20">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* GAUCHE : BIENVENUE */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="h-[2px] w-12 bg-brand-gold"></span>
               <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em]">Tableau de Bord</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
              Salam, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#fff5e0]">Investisseur</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg font-serif italic mb-8 border-l-2 border-brand-gold/30 pl-4">
              "{quote}"
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('screener')}
                className="w-full md:w-auto btn-gold shadow-glow flex justify-center items-center gap-2"
              >
                🔍 Scanner le Marché
              </button>
              <button 
                onClick={() => onNavigate('portfolio')}
                className="w-full md:w-auto px-6 py-3 rounded-lg border border-brand-gold/30 text-brand-gold font-bold uppercase text-xs tracking-widest hover:bg-brand-gold/10 transition text-center"
              >
                💼 Mon Portefeuille
              </button>
            </div>
          </div>

          {/* DROITE : WIDGET RÉSUMÉ */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-inner mt-4 lg:mt-0">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Votre Situation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-brand-dark-lighter border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Capital Investi</p>
                      <p className="text-xl md:text-2xl font-serif font-bold text-white mt-1 truncate">{formatMoney(portfolioSummary.total)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-dark-lighter border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Positions</p>
                      <p className="text-xl md:text-2xl font-serif font-bold text-brand-gold mt-1">{portfolioSummary.count}</p>
                  </div>
                  <div className="col-span-2 p-4 rounded-xl bg-brand-dark-lighter border border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition group" onClick={() => onNavigate('watchlist')}>
                      <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Favoris (Watchlist)</p>
                          <p className="text-base md:text-lg font-bold text-white mt-1">{watchlistCount} actifs suivis</p>
                      </div>
                      <span className="text-brand-gold group-hover:translate-x-2 transition-transform">→</span>
                  </div>
              </div>
          </div>
        </div>
        
        {/* Décoration Fond */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* SECTION MARCHÉS */}
      <div>
          <h3 className="font-display text-xl font-bold text-brand-dark mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-brand-gold rotate-45"></span>
            Météo des Marchés
          </h3>
          
          {/* RESPONSIVE GRID: 1 colonne mobile, 3 PC */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {loading ? (
                [1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)
            ) : (
                marketData.map(asset => (
                    <MarketCard key={asset.ticker} asset={asset} />
                ))
            )}
            {!loading && marketData.length === 0 && (
                <div className="col-span-1 md:col-span-3 text-center py-8 text-gray-400 italic bg-white rounded-2xl border border-dashed border-gray-200 text-sm">
                    Données momentanément indisponibles.
                </div>
            )}
          </div>
      </div>

      {/* ACCÈS RAPIDES */}
      {/* RESPONSIVE GRID: 1 colonne mobile, 2 tablettes, 4 PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardCard 
          icon="🚀" 
          title="Simulateur" 
          desc="Projection Monte Carlo & Intérêts Composés."
          onClick={() => onNavigate('simulator')}
        />
        <DashboardCard 
          icon="⚖️" 
          title="Comparateur" 
          desc="Duel boursier : Quelle action est la plus pure ?"
          onClick={() => onNavigate('comparator')}
        />
        <DashboardCard 
          icon="🤲" 
          title="Zakat & Purif" 
          desc="Calculateur intelligent avec seuil Or/Argent."
          onClick={() => onNavigate('zakat')}
        />
        <DashboardCard 
          icon="🎓" 
          title="Académie" 
          desc="Apprenez les bases de la finance éthique."
          onClick={() => onNavigate('academy')}
        />
      </div>

    </div>
  );
}

function DashboardCard({ icon, title, desc, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-brand-gold/20 p-6 rounded-2xl cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5 transition-all duration-300 active:scale-95 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
      <div className="text-3xl mb-4 text-brand-dark group-hover:scale-110 transition-transform duration-300 origin-left">{icon}</div>
      <h3 className="font-display font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-gold transition-colors">{title}</h3>
      <p className="text-xs text-gray-500 font-serif leading-relaxed">{desc}</p>
    </div>
  );
}

function MarketCard({ asset }) {
    const price = asset.technicals?.current_price || 0;
    const rsi = asset.technicals?.rsi || 50;
    const isCrypto = asset.type === 'CRYPTO';
    const nameMap = { 'BTC-USD': 'Bitcoin', 'GC=F': 'Or (Gold)', 'SPUS': 'S&P 500 Halal' };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-brand-dark text-sm uppercase tracking-wide">{nameMap[asset.ticker] || asset.ticker}</span>
                    {isCrypto && <span className="text-[8px] bg-orange-100 text-orange-600 px-1 rounded font-bold">24h</span>}
                </div>
                <div className="text-xl font-mono font-bold text-gray-700">
                    {asset.ticker === 'GC=F' ? price.toFixed(1) : price.toLocaleString()} 
                    <span className="text-xs text-gray-400 ml-1">{asset.ticker === 'GC=F' ? '$ /oz' : '$'}</span>
                </div>
            </div>
            <div className="text-right">
                <div className={`text-[10px] font-bold px-2 py-1 rounded mb-1 inline-block border ${rsi < 30 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : rsi > 70 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    RSI: {rsi}
                </div>
            </div>
        </div>
    );
}