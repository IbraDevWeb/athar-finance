import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Search, TrendingUp, TrendingDown, Activity, Clock, BarChart2, DollarSign, Calendar } from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api'; // Ou ton URL locale pour tester

export default function ChartModule() {
  const [ticker, setTicker] = useState('AAPL');
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
    { label: '5A', val: '5y' },
    { label: 'MAX', val: 'max' }
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

  // Couleurs dynamiques (Vert si positif, Rouge si négatif)
  const isPositive = data?.change_p >= 0;
  const mainColor = isPositive ? '#10b981' : '#ef4444'; // Emerald vs Red
  const gradientId = "colorPrice";

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
      
      {/* HEADER DE RECHERCHE */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="text-brand-gold" /> Market Watch
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Analyse technique des cours en temps réel.</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            value={inputTicker}
            onChange={(e) => setInputTicker(e.target.value)}
            placeholder="Rechercher (ex: TSLA, BTC-USD...)"
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-brand-gold font-bold uppercase transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </form>
      </div>

      {/* ZONE PRINCIPALE */}
      {data && (
        <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8">
          
          {/* EN-TÊTE DU GRAPHIQUE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-white/5">
            <div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">{data.ticker}</h2>
                <span className="text-xl text-gray-400 font-medium">{data.name}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-200">
                  {data.current_price?.toLocaleString()} <span className="text-sm">{data.currency}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                  {isPositive ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                  {data.change_p > 0 ? '+' : ''}{data.change_p}%
                </span>
              </div>
            </div>

            {/* SÉLECTEUR DE PÉRIODE */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
              {periods.map((p) => (
                <button
                  key={p.val}
                  onClick={() => setPeriod(p.val)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === p.val ? 'bg-white dark:bg-gray-800 text-brand-dark shadow-sm scale-105' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* LE GRAPHIQUE (CHART) */}
          <div className="h-[400px] w-full relative">
            {loading && (
               <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-gold border-t-transparent"></div>
               </div>
            )}
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={mainColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  hide={true} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  orientation="right" 
                  tick={{fill: '#9ca3af', fontSize: 10}} 
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                  labelStyle={{color: '#9ca3af', marginBottom: '5px'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={mainColor} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill={`url(#${gradientId})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* GRAPHIQUE VOLUME (Miniature en dessous) */}
          <div className="h-[100px] w-full mt-4 border-t border-gray-100 dark:border-white/5 pt-4">
             <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Volumes</p>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.history}>
                 <Bar dataKey="volume" fill={mainColor} opacity={0.3} radius={[2, 2, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* STATS RAPIDES EN BAS */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
           <StatCard icon={<Clock size={16}/>} label="Ouverture" value={data.history[data.history.length-1].open} />
           <StatCard icon={<TrendingUp size={16}/>} label="Plus Haut" value={data.history[data.history.length-1].high} />
           <StatCard icon={<TrendingDown size={16}/>} label="Plus Bas" value={data.history[data.history.length-1].low} />
           <StatCard icon={<BarChart2 size={16}/>} label="Volume" value={(data.history[data.history.length-1].volume / 1000000).toFixed(2) + ' M'} />
        </div>
      )}

    </div>
  );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-full bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}