import React, { useState, useEffect } from 'react';

const API_URL = 'https://athar-api.onrender.com/api';

// --- MÉGA LISTE DES TICKERS (Classés par Onglets) ---
const MARKET_CATEGORIES = {
  US_TECH: { 
    label: "🇺🇸 US Tech", 
    items: [
      { t: "AAPL", n: "Apple" }, { t: "MSFT", n: "Microsoft" }, { t: "GOOGL", n: "Google" },
      { t: "AMZN", n: "Amazon" }, { t: "TSLA", n: "Tesla" }, { t: "NVDA", n: "NVIDIA" },
      { t: "META", n: "Meta" }, { t: "NFLX", n: "Netflix" }, { t: "ADBE", n: "Adobe" },
      { t: "CRM", n: "Salesforce" }, { t: "AMD", n: "AMD" }, { t: "INTC", n: "Intel" }
    ]
  },
  FRANCE: { 
    label: "🇫🇷 CAC 40", 
    items: [
      { t: "MC.PA", n: "LVMH" }, { t: "OR.PA", n: "L'Oréal" }, { t: "RMS.PA", n: "Hermès" },
      { t: "TTE.PA", n: "Total" }, { t: "SAN.PA", n: "Sanofi" }, { t: "AIR.PA", n: "Airbus" },
      { t: "AI.PA", n: "Air Liquide" }, { t: "BN.PA", n: "Danone" }, { t: "KER.PA", n: "Kering" },
      { t: "RNO.PA", n: "Renault" }, { t: "STMPA.PA", n: "STMicro" }, { t: "CAP.PA", n: "Capgemini" }
    ]
  },
  ISLAMIC: { 
    label: "☪️ Halal & Golfe", 
    items: [
      { t: "SPUS", n: "S&P500 Sharia" }, { t: "HLAL", n: "Wahed FTSE" }, { t: "ISDW.L", n: "MSCI World" },
      { t: "ISDU.L", n: "MSCI USA" }, { t: "1120.SR", n: "Al Rajhi (SA)" }, { t: "2222.SR", n: "Aramco (SA)" },
      { t: "2010.SR", n: "SABIC (SA)" }, { t: "1150.SR", n: "Alinma (SA)" }, { t: "UMMA", n: "Wahed ESG" }
    ]
  },
  CRYPTO: { 
    label: "🪙 Cryptos", 
    items: [
      { t: "BTC-USD", n: "Bitcoin" }, { t: "ETH-USD", n: "Ethereum" }, { t: "SOL-USD", n: "Solana" },
      { t: "AVAX-USD", n: "Avalanche" }, { t: "BNB-USD", n: "Binance" }, { t: "ADA-USD", n: "Cardano" },
      { t: "XRP-USD", n: "Ripple" }, { t: "DOT-USD", n: "Polkadot" }, { t: "LINK-USD", n: "Chainlink" }
    ]
  },
  COMMODITIES: { 
    label: "🥇 Or & Divers", 
    items: [
      { t: "GLDM", n: "Gold Mini" }, { t: "SGLD.L", n: "Invesco Gold" }, { t: "PHAU.L", n: "WisdomTree" },
      { t: "SLV", n: "Silver Trust" }, { t: "PPLT", n: "Platinum" }, { t: "JNJ", n: "J&J (Div)" },
      { t: "KO", n: "Coca-Cola" }, { t: "PEP", n: "PepsiCo" }, { t: "PG", n: "P&G" }
    ]
  }
};

export default function ScreenerModule({ autoSearch }) {
  
  const [activeTab, setActiveTab] = useState('US_TECH');
  const [inputStr, setInputStr] = useState(autoSearch || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- WATCHLIST ---
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('myWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (ticker) => {
    if (watchlist.includes(ticker)) {
      setWatchlist(watchlist.filter(t => t !== ticker));
    } else {
      setWatchlist([...watchlist, ticker]);
    }
  };

  // --- LOGIQUE D'AJOUT (CUMULATIF) ---
  const addTickerToInput = (ticker) => {
    // On nettoie l'entrée actuelle
    let currentTickers = inputStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    // Si le ticker n'est pas déjà là, on l'ajoute
    if (!currentTickers.includes(ticker)) {
        currentTickers.push(ticker);
        setInputStr(currentTickers.join(', '));
    }
  };

  // --- ANALYSE ---
  useEffect(() => {
    if (autoSearch) {
      setInputStr(autoSearch);
      handleAnalyze(autoSearch);
    }
  }, [autoSearch]);

  const handleAnalyze = async (tickerOverride = null) => {
    const tickersToAnalyze = tickerOverride || inputStr;
    if (!tickersToAnalyze) return;
    // Pas de setInputStr ici pour garder la liste visible

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`${API_URL}/screening/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: tickersToAnalyze })
      });
      const data = await response.json();
      if (data.success) setResults(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const headers = [
        "Ticker", "Nom", "Type", "Halal", "Score", 
        "Dette %", "Cash %", "RSI", "Position Annee %", 
        "PER", "ROE", "Div %", "Rating"
    ];
    const rows = results.map(r => [
      r.ticker, `"${r.name}"`, r.type, r.is_halal ? "OUI" : "NON", r.sharia_score,
      r.ratios.debt, r.ratios.cash, r.technicals.rsi, r.technicals.position_52w,
      r.financials.per, r.financials.roe, r.financials.div, r.rating
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `halal_invest_scan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatMoney = (amount) => {
    if (!amount) return "N/A";
    if (amount >= 1e9) return (amount / 1e9).toFixed(2) + " Md";
    if (amount >= 1e6) return (amount / 1e6).toFixed(2) + " M";
    return amount.toLocaleString();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER & SÉLECTEUR */}
      <div className="glass rounded-3xl p-8 border-t-4 border-brand-gold bg-gradient-to-b from-white to-brand-paper">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-2">🔍 Screener Pro & Multi-Actifs</h2>
            <p className="text-gray-500 font-serif italic">Composez votre panier d'actions, ETFs ou Cryptos et analysez tout d'un coup.</p>
        </div>

        {/* INPUT BAR (LARGE) */}
        <div className="max-w-3xl mx-auto mb-8 relative">
            <div className="flex shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                <input
                    type="text"
                    placeholder="Cliquez sur les boutons ci-dessous pour ajouter (ex: AAPL, BTC-USD...)"
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value.toUpperCase())}
                    className="flex-1 px-6 py-4 text-lg font-bold text-brand-dark bg-white outline-none placeholder-gray-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <div className="bg-gray-50 flex items-center px-2 border-l border-gray-200">
                    {inputStr && (
                        <button onClick={() => setInputStr('')} className="p-2 text-gray-400 hover:text-red-500 transition" title="Effacer">✕</button>
                    )}
                </div>
                <button 
                    onClick={() => handleAnalyze()} 
                    disabled={loading} 
                    className="bg-brand-dark text-brand-gold px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {loading ? <span className="animate-spin">⏳</span> : 'SCANNER'}
                </button>
            </div>
        </div>

        {/* ONGLETS CATÉGORIES */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-gray-200 pb-1">
            {Object.entries(MARKET_CATEGORIES).map(([key, cat]) => (
                <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-5 py-2 rounded-t-xl text-xs font-bold uppercase tracking-widest transition-all ${
                        activeTab === key 
                        ? 'bg-brand-gold text-white shadow-md translate-y-[1px]' 
                        : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>

        {/* GRILLE DE BOUTONS (SUGGESTIONS) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-in">
            {MARKET_CATEGORIES[activeTab].items.map((asset) => (
                <button 
                    key={asset.t}
                    onClick={() => addTickerToInput(asset.t)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-white hover:border-brand-gold hover:shadow-md transition-all group active:scale-95"
                >
                    <span className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{asset.t}</span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide truncate w-full text-center">{asset.n}</span>
                </button>
            ))}
        </div>
      </div>

      {/* RÉSULTATS (TABLEAU PRO) */}
      {results.length > 0 && (
        <div className="glass rounded-3xl p-6 overflow-x-auto shadow-2xl border border-brand-gold/10">
          <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-display font-bold text-brand-dark flex items-center gap-3 text-xl">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Résultats d'Analyse
              </h3>
              <button onClick={handleExportCSV} className="btn-outline flex items-center gap-2 text-[10px] py-2 h-9 bg-white hover:bg-gray-50">
                 ⬇️ Exporter CSV
              </button>
          </div>

          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-sans h-12 border-b border-gray-200">
                <th className="p-4 text-center rounded-tl-xl">Fav</th>
                <th className="p-4 w-56">Actif / Nom</th>
                <th className="p-4 text-center">Score Sharia</th>
                <th className="p-4 text-center">Verdict</th>
                <th className="p-4 text-center w-40">Dette (&lt;33%)</th>
                <th className="p-4 text-center w-40">Cash (&lt;33%)</th>
                <th className="p-4 text-center w-32 border-l border-gray-100">RSI (14j)</th>
                <th className="p-4 text-center w-40">Range 52s</th>
                <th className="p-4 text-center w-24 border-l border-gray-100 text-blue-600">PER</th>
                <th className="p-4 text-center w-24 text-blue-600">ROE</th>
                <th className="p-4 text-center w-24 text-blue-600">Div</th>
                <th className="p-4 text-center rounded-tr-xl">Qualité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm bg-white">
              {results.map((stock, index) => {
                const isFav = watchlist.includes(stock.ticker);
                const isCrypto = stock.type === 'CRYPTO';
                
                let scoreColor = "bg-red-500";
                if(stock.sharia_score >= 80) scoreColor = "bg-emerald-500";
                else if(stock.sharia_score >= 50) scoreColor = "bg-yellow-400";

                // RSI Logic
                const rsi = stock.technicals.rsi;
                let rsiBadge = "bg-gray-100 text-gray-500";
                if (rsi <= 30) rsiBadge = "bg-emerald-100 text-emerald-700 font-bold border border-emerald-200";
                if (rsi >= 70) rsiBadge = "bg-red-100 text-red-700 font-bold border border-red-200";

                // Colors for Financials
                let perColor = "text-gray-400";
                const perVal = parseFloat(stock.financials.per);
                if (!isNaN(perVal)) {
                    if (perVal < 15 && perVal > 0) perColor = "text-emerald-600 font-bold";
                    if (perVal > 25) perColor = "text-red-500 font-bold";
                }
                let divColor = "text-gray-400";
                const divVal = parseFloat(stock.financials.div);
                if (!isNaN(divVal) && divVal > 2) divColor = "text-emerald-600 font-bold";

                return (
                  <tr key={index} className="hover:bg-brand-paper/50 transition group">
                    
                    {/* FAV */}
                    <td className="p-4 text-center">
                      <button onClick={() => toggleWatchlist(stock.ticker)} className={`text-xl transition hover:scale-125 ${isFav ? 'text-red-500' : 'text-gray-200 hover:text-red-300'}`}>
                        {isFav ? '❤️' : '🤍'}
                      </button>
                    </td>

                    {/* NOM */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-xs text-brand-dark shadow-sm">
                              {stock.ticker.substring(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-brand-dark">{stock.ticker}</span>
                                {isCrypto && <span className="text-[8px] bg-orange-100 text-orange-600 px-1.5 rounded font-bold border border-orange-200">CRYPTO</span>}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[140px]">{stock.name}</div>
                            <div className="font-mono text-[10px] font-bold text-brand-gold mt-0.5">
                                {stock.technicals.current_price ? formatMoney(stock.technicals.current_price) : ''}
                            </div>
                          </div>
                      </div>
                    </td>

                    {/* SCORE */}
                    <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-gray-700 text-xs">{stock.sharia_score}/100</span>
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${scoreColor}`} style={{ width: `${stock.sharia_score}%` }}></div>
                            </div>
                        </div>
                    </td>

                    {/* VERDICT */}
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-sm ${stock.is_halal ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {stock.is_halal ? 'HALAL' : 'HARAM'}
                      </span>
                      {!stock.is_halal && (
                          <div className="text-[9px] text-red-500 mt-1 max-w-[120px] mx-auto truncate bg-red-50 px-1 rounded border border-red-100" title={stock.reason}>{stock.reason}</div>
                      )}
                    </td>

                    {/* DETTE */}
                    <td className="p-4 text-center">
                        {isCrypto ? <span className="text-gray-300">-</span> : (
                            <div className="flex flex-col items-center w-full">
                                <span className={`font-mono text-xs font-bold ${stock.ratios.debt > 33 ? 'text-red-500' : 'text-emerald-600'}`}>{stock.ratios.debt}%</span>
                                <div className="w-24 h-1.5 bg-gray-100 mt-1 rounded-full overflow-hidden relative border border-gray-200">
                                    <div className="absolute left-[33%] top-0 bottom-0 w-0.5 bg-red-300 z-10 opacity-50"></div>
                                    <div className={`h-full ${stock.ratios.debt > 33 ? 'bg-red-500' : 'bg-emerald-400'}`} style={{ width: `${Math.min(stock.ratios.debt, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                    </td>

                    {/* CASH */}
                    <td className="p-4 text-center">
                        {isCrypto ? <span className="text-gray-300">-</span> : (
                            <div className="flex flex-col items-center w-full">
                                <span className={`font-mono text-xs font-bold ${stock.ratios.cash > 33 ? 'text-red-500' : 'text-emerald-600'}`}>{stock.ratios.cash}%</span>
                                <div className="w-24 h-1.5 bg-gray-100 mt-1 rounded-full overflow-hidden relative border border-gray-200">
                                    <div className="absolute left-[33%] top-0 bottom-0 w-0.5 bg-red-300 z-10 opacity-50"></div>
                                    <div className={`h-full ${stock.ratios.cash > 33 ? 'bg-red-500' : 'bg-emerald-400'}`} style={{ width: `${Math.min(stock.ratios.cash, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                    </td>

                    {/* RSI */}
                    <td className="p-4 text-center border-l border-gray-100">
                        <div className={`inline-block px-2.5 py-1 rounded text-[10px] ${rsiBadge}`}>
                            {rsi}
                        </div>
                    </td>

                    {/* 52 SEMAINES */}
                    <td className="p-4 text-center">
                        <div className="flex items-center gap-1.5 justify-center w-full">
                            <span className="text-[8px] text-gray-400 font-bold">L</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative max-w-[80px] border border-gray-200">
                                <div className="absolute top-0 bottom-0 w-2 h-2 bg-brand-dark rounded-full shadow-md -mt-[2px] border border-white" style={{ left: `${stock.technicals.position_52w}%` }}></div>
                            </div>
                            <span className="text-[8px] text-gray-400 font-bold">H</span>
                        </div>
                    </td>

                    {/* FINANCIALS */}
                    <td className={`p-4 text-center border-l border-gray-100 font-mono text-xs ${perColor}`}>
                        {stock.financials.per}
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-gray-600">
                        {stock.financials.roe !== "N/A" ? stock.financials.roe + '%' : '-'}
                    </td>
                    <td className={`p-4 text-center font-mono text-xs ${divColor}`}>
                        {stock.financials.div !== "0" ? stock.financials.div + '%' : '-'}
                    </td>

                    {/* NOTE */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center text-brand-gold text-[10px] gap-0.5">
                        {[...Array(5)].map((_, i) => (<span key={i} className={i < stock.rating ? "opacity-100" : "opacity-20 grayscale"}>★</span>))}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}