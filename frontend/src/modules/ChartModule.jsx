import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Search, TrendingUp, TrendingDown, Activity, Clock, 
  BarChart2, ArrowUpRight, ArrowDownRight, RefreshCw, Zap 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ChartModule() {
  const [ticker, setTicker] = useState('NVDA');
  const [inputTicker, setInputTicker] = useState('');
  const [period, setPeriod] = useState('1y');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Périodes
  const periods = [
    { label: '1J', val: '1d' },
    { label: '1S', val: '5d' },
    { label: '1M', val: '1mo' },
    { label: '6M', val: '6mo' },
    { label: '1A', val: '1y' },
    { label: '5A', val: '5y' }
  ];

  useEffect(() => {
    fetchChartData(ticker, period);
  }, [ticker, period]);

  const fetchChartData = async (sym, time) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chart/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: sym, period: time })
      });
      const json = await res.json();
      if (json.history) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputTicker) {
      setTicker(inputTicker.toUpperCase());
      setInputTicker('');
    }
  };

  const isPositive = data?.change_p >= 0;
  // Vert Menthe moderne vs Rouge Corail
  const mainColor = isPositive ? '#34d399' : '#f87171'; 
  const gradientId = "colorPrice";

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-8">
      
      {/* --- HEADER ÉPURÉ --- */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 pt-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
             <span className="w-2 h-8 bg-brand-gold rounded-full"></span>
             Market Terminal
          </h1>
          <p className="text-gray-400 text-sm mt-1 ml-5 font-medium">Données de marché en temps réel</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Search className="text-gray-400 group-focus-within:text-brand-gold transition-colors" size={18} />
          </div>
          <input
            type="text"
            value={inputTicker}
            onChange={(e) => setInputTicker(e.target.value)}
            placeholder="RECHERCHER UN ACTIF (EX: TSLA)..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold font-bold uppercase tracking-widest text-sm transition-all shadow-sm hover:shadow-md"
          />
        </form>
      </div>

      {/* --- CARTE PRINCIPALE --- */}
      <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden relative min-h-[600px] flex flex-col">
        
        {loading && (
           <div className="absolute inset-0 z-20 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-white/10 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
             </div>
             <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 animate-pulse">Chargement des données</p>
           </div>
        )}

        {data ? (
          <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
            
            {/* 1. INFO HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-white/5">
                      {data.currency} MARKET
                   </span>
                   <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide">{data.name}</h2>
                </div>
                
                <div className="flex items-end gap-6">
                  <h1 className="text-6xl md:text-7xl font-display font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                    {data.ticker}
                  </h1>
                  <div className="mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
                          {data.current_price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 font-bold">$</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-bold mt-1 px-3 py-1 rounded-lg w-fit ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {isPositive ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                        {data.change_p > 0 ? '+' : ''}{data.change_p}%
                      </div>
                  </div>
                </div>
              </div>

              {/* SÉLECTEUR PÉRIODE (Style "Capsule") */}
              <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5">
                {periods.map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPeriod(p.val)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all duration-300 ${period === p.val ? 'bg-white dark:bg-[#1a1a1a] text-brand-dark dark:text-white shadow-lg shadow-gray-200/50 dark:shadow-none scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. GRAPHIQUE (Simplifié & Fiable) */}
            <div className="flex-1 w-full relative min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={mainColor} stopOpacity={0.25}/>
                      <stop offset="100%" stopColor={mainColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grille très subtile */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isPositive ? "#10b981" : "#f43f5e"} strokeOpacity={0.1} />
                  
                  <XAxis dataKey="date" hide={true} />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    orientation="right" 
                    tick={{fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold'}} 
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(val) => val.toFixed(0)}
                  />
                  
                  <Tooltip 
                    content={<CustomTooltip currency={data.currency} />} 
                    cursor={{ stroke: mainColor, strokeWidth: 1, strokeDasharray: '5 5' }} 
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={mainColor} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={`url(#${gradientId})`} 
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 3. VOLUME (Barres discrètes en bas) */}
            <div className="h-[50px] w-full mt-4 opacity-40">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.history}>
                   <Bar dataKey="volume" fill={mainColor} radius={[2, 2, 0, 0]} barSize={4} />
                 </BarChart>
               </ResponsiveContainer>
            </div>

          </div>
        ) : (
          /* ÉTAT VIDE (PLACEHOLDER) */
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-gray-300 dark:text-gray-700">
             <div className="p-6 rounded-full bg-gray-50 dark:bg-white/5 mb-6 animate-pulse">
                <Activity size={48} strokeWidth={1} />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest text-gray-400">En attente d'un signal...</p>
          </div>
        )}
      </div>

      {/* --- STATS FOOTER (Cartes Flottantes) --- */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <StatCard label="Ouverture" value={data.history[data.history.length-1].open} icon={<Clock size={16}/>} />
           <StatCard label="Plus Haut" value={data.history[data.history.length-1].high} icon={<TrendingUp size={16}/>} color="text-emerald-500" />
           <StatCard label="Plus Bas" value={data.history[data.history.length-1].low} icon={<TrendingDown size={16}/>} color="text-rose-500" />
           <StatCard label="Volume" value={(data.history[data.history.length-1].volume / 1000000).toFixed(2) + ' M'} icon={<Zap size={16}/>} />
        </div>
      )}
    </div>
  );
}

// --- TOOLTIP HUD (Ultra-Minimaliste) ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-white border border-transparent dark:border-gray-200 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-xl font-mono font-bold text-white dark:text-gray-900">
          {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

function StatCard({ icon, label, value, color = "text-gray-900 dark:text-white" }) {
    return (
        <div className="group bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-wider">{label}</p>
                <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-50 dark:bg-white/5 text-gray-300 group-hover:text-brand-gold group-hover:bg-brand-gold/10 transition-colors">
                {icon}
            </div>
        </div>
    );
}