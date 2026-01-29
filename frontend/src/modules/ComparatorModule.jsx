import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function ComparatorModule() {
  const [inputStr, setInputStr] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ajout d'un ticker à la liste
  const handleAdd = async () => {
    if (!inputStr) return;
    if (competitors.length >= 4) {
      setError("Maximum 4 actions pour la comparaison.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // On réutilise la route existante du Screener !
      const response = await fetch(`${API_URL}/screening/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: inputStr })
      });
      const data = await response.json();
      
      if (data.success && data.results.length > 0) {
        // On évite les doublons
        const newStock = data.results[0];
        if (!competitors.find(c => c.ticker === newStock.ticker)) {
            setCompetitors([...competitors, newStock]);
        }
        setInputStr('');
      } else {
        setError("Action introuvable ou erreur serveur.");
      }
    } catch (err) {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const removeCompetitor = (ticker) => {
    setCompetitors(competitors.filter(c => c.ticker !== ticker));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2">
           <span className="text-3xl">⚖️</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">Duel Boursier</h1>
        <p className="font-serif italic text-gray-500">
          "Ne choisissez pas au hasard. Comparez la pureté et la performance."
        </p>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="glass rounded-2xl p-6 max-w-2xl mx-auto border-t-4 border-brand-gold">
         <div className="flex gap-4">
             <input 
                type="text" 
                placeholder="Ajouter une action (ex: MSFT)..."
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1 bg-brand-paper border border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-dark focus:border-brand-gold outline-none uppercase"
             />
             <button 
                onClick={handleAdd}
                disabled={loading}
                className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-brand-dark-lighter transition-colors"
             >
                {loading ? '...' : '+ Ajouter'}
             </button>
         </div>
         {error && <p className="text-red-500 text-xs mt-3 text-center font-bold">{error}</p>}
      </div>

      {/* ZONE DE COMPARAISON */}
      {competitors.length > 0 ? (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px] grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-0 border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl bg-white">
                
                {/* COLONNE GAUCHE (LABELS) */}
                <div className="bg-brand-paper border-r border-gray-100 flex flex-col">
                    <div className="h-32 p-6 flex items-center font-bold text-gray-400 uppercase tracking-widest text-xs">Entreprise</div>
                    <div className="h-16 p-4 flex items-center font-bold text-brand-dark border-t border-gray-100 bg-gray-50/50">Verdict Halal</div>
                    <div className="h-16 p-4 flex items-center font-bold text-brand-dark border-t border-gray-100">Score Sharia</div>
                    <div className="h-16 p-4 flex items-center font-bold text-brand-dark border-t border-gray-100 bg-gray-50/50">Dette (Max 33%)</div>
                    <div className="h-16 p-4 flex items-center font-bold text-brand-dark border-t border-gray-100">Cash (Max 33%)</div>
                    <div className="h-16 p-4 flex items-center font-bold text-blue-800 border-t border-gray-100 bg-blue-50/10">PER (Prix)</div>
                    <div className="h-16 p-4 flex items-center font-bold text-emerald-800 border-t border-gray-100 bg-emerald-50/10">Rentabilité (ROE)</div>
                    <div className="h-16 p-4 flex items-center font-bold text-brand-gold border-t border-gray-100 bg-amber-50/10">Dividende</div>
                </div>

                {/* COLONNES ACTIONS */}
                {competitors.map((stock, idx) => (
                    <div key={stock.ticker} className="flex flex-col border-r border-gray-100 last:border-0 relative group">
                        {/* Bouton Supprimer */}
                        <button 
                            onClick={() => removeCompetitor(stock.ticker)}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors z-10"
                        >
                            ✕
                        </button>

                        {/* Header Action */}
                        <div className="h-32 p-6 flex flex-col justify-center items-center text-center bg-white">
                            <div className="w-12 h-12 rounded-lg bg-brand-dark text-white flex items-center justify-center font-bold text-sm mb-2 shadow-lg">
                                {stock.ticker.substring(0, 2)}
                            </div>
                            <h3 className="font-bold text-brand-dark text-lg leading-none">{stock.ticker}</h3>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{stock.name}</p>
                        </div>

                        {/* Verdict */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100 bg-gray-50/50">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${stock.is_halal ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                {stock.is_halal ? 'HALAL' : 'HARAM'}
                            </span>
                        </div>

                        {/* Score */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100">
                             <div className="flex flex-col items-center">
                                <span className="font-bold text-xl">{stock.sharia_score}</span>
                                <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                    <div className="h-full bg-brand-gold rounded-full" style={{width: `${stock.sharia_score}%`}}></div>
                                </div>
                             </div>
                        </div>

                        {/* Dette */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100 bg-gray-50/50 font-mono">
                            <span className={stock.ratios.debt > 33 ? 'text-red-500 font-bold' : 'text-emerald-600'}>
                                {stock.ratios.debt}%
                            </span>
                        </div>

                        {/* Cash */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100 font-mono">
                            <span className={stock.ratios.cash > 33 ? 'text-red-500 font-bold' : 'text-emerald-600'}>
                                {stock.ratios.cash}%
                            </span>
                        </div>

                        {/* PER */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100 bg-blue-50/10 font-bold text-blue-900">
                            {stock.financials.per}
                        </div>

                        {/* ROE */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100 bg-emerald-50/10 font-bold text-emerald-700">
                            {stock.financials.roe !== 'N/A' ? stock.financials.roe + '%' : '-'}
                        </div>

                        {/* Dividende */}
                        <div className="h-16 flex items-center justify-center border-t border-gray-100 bg-amber-50/10 font-bold text-brand-gold">
                            {stock.financials.div !== '0' ? stock.financials.div + '%' : '-'}
                        </div>
                    </div>
                ))}

                {/* Case vide pour inviter à ajouter */}
                {competitors.length < 4 && (
                    <div className="hidden md:flex flex-col justify-center items-center text-gray-300 p-8 border-l border-dashed border-gray-200 bg-gray-50/30">
                        <span className="text-4xl mb-2 opacity-20">+</span>
                        <span className="text-xs uppercase tracking-widest opacity-50">Ajouter</span>
                    </div>
                )}
            </div>
        </div>
      ) : (
        <div className="text-center py-20 opacity-30">
            <div className="text-6xl grayscale mb-4">⚖️</div>
            <p className="text-xl font-display font-bold">La balance est vide.</p>
            <p>Ajoutez au moins deux actions pour commencer le duel.</p>
        </div>
      )}
    </div>
  );
}