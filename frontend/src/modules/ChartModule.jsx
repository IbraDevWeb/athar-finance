import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Search, TrendingUp, TrendingDown, Activity, Clock, 
  BarChart2, ArrowUpRight, ArrowDownRight, Zap 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ChartModule() {
  const [ticker, setTicker] = useState('NVDA');
  const [inputTicker, setInputTicker] = useState('');
  const [period, setPeriod] = useState('1y');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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
      
      // Petit log pour vérifier dans la console que le prix est bien un nombre
      if (json.history && json.history.length > 0) {
        console.log("Données reçues pour le chart:", json.history[0]); 
      }
      
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
  const mainColor = isPositive ? '#10b981' : '#f43f5e'; 

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 pt-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
             <span className="w-2 h-8 bg-brand-gold rounded-full"></span>
             Market Terminal
          </h1>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <input
            type="text"
            value={inputTicker}
            onChange={(e) => setInputTicker(e.target.value)}
            placeholder="RECHERCHER (EX: TSLA)..."
            className="w-full pl-6 pr-4 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 font-bold uppercase text-sm shadow-sm"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
             <Search size={20} />
          </button>
        </form>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-xl overflow-hidden relative">
        
        {loading && (
           <div className="absolute inset-0 z-20 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
           </div>
        )}

        {data ? (
          <div className="p-8">
            
            {/* INFO HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-1 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
                      {data.currency} MARKET
                   </span>
                   <h2 className="text-sm font-bold text-gray-400 uppercase">{data.name}</h2>
                </div>
                <div className="flex items-baseline gap-4">
                  <h1 className="text-6xl font-display font-bold text-gray-900 dark:text-white">
                    {data.ticker}
                  </h1>
                  <div>
                      <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
                        {data.current_price?.toLocaleString()} <span className="text-sm">$</span>
                      </span>
                      <div className={`text-sm font-bold mt-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {data.change_p > 0 ? '+' : ''}{data.change_p}%
                      </div>
                  </div>
                </div>
              </div>

              {/* PERIODES */}
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                {periods.map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPeriod(p.val)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === p.val ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* GRAPHIQUE CORRIGÉ (Hauteur explicite + Pas de gradient) */}
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={mainColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="date" hide={true} />
                  
                  {/* CORRECTION: domain=['dataMin', 'dataMax'] pour zoomer sur la courbe */}
                  <YAxis 
                    domain={['dataMin', 'dataMax']} 
                    orientation="right" 
                    tick={{fontSize: 10}} 
                    axisLine={false} 
                    tickLine={false}
                    width={40}
                  />
                  
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={mainColor} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* VOLUME (En dessous) */}
            <div className="w-full h-[60px] mt-4 opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.history}>
                   <Bar dataKey="volume" fill={mainColor} />
                 </BarChart>
               </ResponsiveContainer>
            </div>

          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
             Recherche un actif pour commencer...
          </div>
        )}
      </div>

      {/* STATS */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatBox label="Ouverture" value={data.history[data.history.length-1].open} />
           <StatBox label="Plus Haut" value={data.history[data.history.length-1].high} color="text-emerald-500" />
           <StatBox label="Plus Bas" value={data.history[data.history.length-1].low} color="text-red-500" />
           <StatBox label="Volume" value={(data.history[data.history.length-1].volume / 1000000).toFixed(2) + ' M'} />
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color = "text-gray-900 dark:text-white" }) {
    return (
        <div className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
            <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
        </div>
    );
}