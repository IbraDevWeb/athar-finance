import { API_URL } from '../services/api';
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LiveMarket() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMarket = async () => {
    try {
      const res = await fetch(`${API_URL}/market/live-prices`);
      const json = await res.json();
      if (!res.ok || !Array.isArray(json)) throw new Error(json.error || 'Cotations indisponibles');
      setData(json);
      setError('');
    } catch (err) {
      setError(err.message || 'Cotations indisponibles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000); // Update toutes les minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-3xl shadow-xl w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Marchés en Direct</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {error && <p role="status" className="mb-3 text-xs text-red-500">{error}</p>}
        {loading ? (
          <div className="h-20 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl"></div>
        ) : data.map((asset) => (
          <div key={asset.symbol} className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold dark:text-white">{asset.name}</p>
              <p className="text-[9px] text-gray-400 font-mono">{asset.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold dark:text-white">{asset.price} {asset.currency}</p>
              <p className={`text-[10px] font-bold flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {asset.change >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                {asset.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}