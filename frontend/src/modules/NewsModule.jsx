import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Image as ImageIcon } from 'lucide-react';

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

  // Logique de couleur simplifiée basée sur le label envoyé par le backend
  const getBadgeStyle = (label) => {
    switch(label) {
      case 'Bitcoin': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Or': 
      case 'Argent': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto mb-20 px-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold shadow-glow-sm">
            <Newspaper size={28} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">Market Pulse</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Analyses et actualités stratégiques</p>
          </div>
        </div>
        <button 
          onClick={fetchNews} 
          disabled={loading}
          className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-90"
        >
          <RefreshCw size={20} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* LISTE DES NEWS */}
      <div className="space-y-4">
        {loading ? (
            [1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse"></div>
            ))
        ) : news.length > 0 ? (
            news.map((item, index) => (
            <a 
                key={index} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex gap-4 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:border-brand-gold/40 hover:-translate-y-1"
            >
                {/* THUMBNAIL (IMAGE) */}
                <div className="hidden sm:block w-32 h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 relative">
                    {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={24} />
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(item.asset_label)}`}>
                                {item.asset_label}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                                {item.publisher} • {item.date}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug text-base md:text-lg">
                            {item.title}
                        </h3>
                    </div>
                    
                    {/* OPTIONNEL : Petit résumé si disponible */}
                    {item.summary && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 hidden md:block">
                        {item.summary}
                      </p>
                    )}
                </div>

                <div className="flex items-center pr-2">
                    <ExternalLink size={18} className="text-gray-300 group-hover:text-brand-gold transition-colors" />
                </div>
            </a>
            ))
        ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-500 italic">Aucune actualité récente disponible pour le moment.</p>
            </div>
        )}
      </div>
    </div>
  );
}