import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function ZakatModule() {
  const [values, setValues] = useState({
    cash: 0, savings: 0, stocks: 0, crypto: 0, gold: 0, debts: 0
  });
  
  // État pour choisir le Nisab (gold par défaut)
  const [nisabType, setNisabType] = useState('gold'); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/zakat/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError("Erreur calcul.");
      }
    } catch (err) {
      setError("Erreur connexion serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Logique d'affichage dynamique selon le choix Or/Argent
  const getCurrentNisab = () => {
    if (!result) return 0;
    return nisabType === 'gold' 
      ? result.nisab_data.gold_threshold 
      : result.nisab_data.silver_threshold;
  };

  const isZakatable = result ? result.net_wealth >= getCurrentNisab() : false;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* FORMULAIRE */}
      <div className="glass rounded-3xl p-8 border-t-4 border-amber-400">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          🤲 Calculateur Zakat Intelligent
        </h2>
        <p className="text-gray-500 mb-8">
          Renseignez vos avoirs (Hawl atteint). Les seuils sont mis à jour en direct.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* ACTIFS */}
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-800 uppercase text-sm border-b border-emerald-100 pb-2">Vos Avoirs (+)</h3>
            <InputRow label="Argent liquide / Compte" name="cash" onChange={handleChange} />
            <InputRow label="Épargne (Livrets)" name="savings" onChange={handleChange} />
            <InputRow label="Actions (Valeur Totale)" name="stocks" onChange={handleChange} />
            <InputRow label="Crypto-monnaies" name="crypto" onChange={handleChange} />
            <InputRow label="Or & Argent (Physique)" name="gold" onChange={handleChange} />
          </div>

          {/* PASSIFS */}
          <div className="space-y-4">
            <h3 className="font-bold text-red-800 uppercase text-sm border-b border-red-100 pb-2">Vos Dettes (-)</h3>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dettes immédiates</label>
              <input type="number" name="debts" onChange={handleChange} className="w-full p-3 rounded-lg border border-red-200" placeholder="0" />
            </div>
          </div>
        </div>

        <button 
          onClick={handleCalculate} disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition hover:scale-[1.01]"
        >
          {loading ? 'Récupération des cours en direct...' : 'Calculer ma Zakat'}
        </button>
      </div>

      {/* RÉSULTATS */}
      {result && (
        <div className="glass rounded-3xl p-8 animate-fade-in">
          
          {/* --- SÉLECTEUR DE NISAB (NOUVEAU) --- */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button 
                onClick={() => setNisabType('gold')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition ${nisabType === 'gold' ? 'bg-white shadow text-amber-600' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                🥇 Seuil OR (Majorité)
              </button>
              <button 
                onClick={() => setNisabType('silver')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition ${nisabType === 'silver' ? 'bg-white shadow text-gray-600' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                🥈 Seuil ARGENT (Précaution)
              </button>
            </div>
          </div>

          <div className="text-center">
            {isZakatable ? (
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-full bg-emerald-100 text-emerald-700 text-5xl mb-2">🕌</div>
                <h3 className="text-2xl font-bold text-emerald-800">Zakat obligatoire</h3>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  {result.zakat_payable.toLocaleString()} €
                </div>
                <p className="text-emerald-700 font-medium">
                  Votre patrimoine ({result.net_wealth.toLocaleString()} €) dépasse le Nisab {nisabType === 'gold' ? 'Or' : 'Argent'}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-full bg-gray-100 text-gray-400 text-5xl mb-2">😌</div>
                <h3 className="text-2xl font-bold text-gray-600">Pas de Zakat</h3>
                <p className="text-gray-500">
                  Votre patrimoine ({result.net_wealth.toLocaleString()} €) est inférieur au seuil.
                </p>
              </div>
            )}

            {/* Détails Techniques */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm">
              <StatItem label="Nisab OR (85g)" value={result.nisab_data.gold_threshold} sub={`Cours: ${result.nisab_data.gold_price_g} €/g`} active={nisabType === 'gold'} />
              <StatItem label="Nisab ARGENT (595g)" value={result.nisab_data.silver_threshold} sub={`Cours: ${result.nisab_data.silver_price_g} €/g`} active={nisabType === 'silver'} />
              <StatItem label="Patrimoine Net" value={result.net_wealth} />
              <StatItem label="Source Données" value={result.nisab_data.source === 'live' ? '🟢 Marché Direct' : '🔴 Sauvegarde'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputRow({ label, name, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <input type="number" name={name} onChange={onChange} className="w-full p-3 mt-1 rounded-xl border border-gray-200 focus:border-amber-400 outline-none" placeholder="0" />
    </div>
  );
}

function StatItem({ label, value, sub, active }) {
  return (
    <div className={`p-3 rounded-xl ${active ? 'bg-amber-50 border border-amber-200' : ''}`}>
      <div className="font-bold text-gray-500 text-xs">{label}</div>
      <div className={`text-lg font-bold ${active ? 'text-amber-700' : 'text-gray-800'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value} {typeof value === 'number' && '€'}
      </div>
      {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
    </div>
  );
}