import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function NewsModule() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/news/latest`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Erreur news:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (asset) => {
    if (asset === 'BTC-USD') return 'bg-orange-100 text-orange-700 border-orange-200';
    if (asset === 'GC=F' || asset === 'SI=F') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getAssetName = (asset) => {
    if (asset === 'BTC-USD') return 'CRYPTO';
    if (asset === 'GC=F') return 'OR/ARGENT';
    if (asset === 'SI=F') return 'ARGENT';
    return 'MARCHÉ US';
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto mb-20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold">
            <Newspaper size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Market Pulse</h2>
            <p className="text-sm text-gray-500">L'actualité qui fait bouger vos actifs</p>
          </div>
        </div>
        <button onClick={fetchNews} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <RefreshCw size={20} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* LISTE DES NEWS */}
      <div className="grid gap-4 px-2">
        {loading ? (
            // Skeleton loading
            [1,2,3].map(i => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
            ))
        ) : news.length > 0 ? (
            news.map((item, index) => (
            <a 
                key={index} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-brand-gold/50"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getBadgeColor(item.related)}`}>
                                {getAssetName(item.related)}
                            </span>
                            <span className="text-xs text-gray-400">{item.publisher} • {item.date}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-gold transition-colors line-clamp-2">
                            {item.title}
                        </h3>
                    </div>
                    <ExternalLink size={18} className="text-gray-300 group-hover:text-brand-gold opacity-0 group-hover:opacity-100 transition-all" />
                </div>
            </a>
            ))
        ) : (
            <div className="text-center p-10 text-gray-500">
                Aucune actualité récente disponible.
            </div>
        )}
      </div>
    </div>
  );
}