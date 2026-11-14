import React, { useEffect, useState } from 'react';
import { ArrowUpRight, AlertCircle, Plus, RefreshCw, Trash2, Wallet } from 'lucide-react';
import { apiRequest } from '../services/api';

const initialPositions = () => {
  try {
    const value = JSON.parse(localStorage.getItem('athar-portfolio') || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
};
const displayNumber = value => value == null ? '—' : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

export default function PortfolioModule() {
  const [positions, setPositions] = useState(initialPositions);
  const [draft, setDraft] = useState({ ticker: '', qty: '', avg_price: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    try { localStorage.setItem('athar-portfolio', JSON.stringify(positions)); } catch { /* Storage disabled. */ }
  }, [positions]);

  useEffect(() => {
    if (!positions.length) { setResult(null); setError(''); setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiRequest('/portfolio/analyze', {
      method: 'POST',
      body: JSON.stringify({ assets: positions }),
      signal: controller.signal,
    }).then(data => setResult(data.result)).catch(e => {
      if (e.name !== 'AbortError') setError(e.message || 'Valorisation indisponible.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [positions, revision]);

  const addPosition = event => {
    event.preventDefault();
    const ticker = draft.ticker.trim().toUpperCase();
    const qty = Number(draft.qty);
    const avg_price = Number(draft.avg_price);
    if (!/^[A-Z0-9.^=\-]{1,20}$/.test(ticker) || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(avg_price) || avg_price < 0) {
      setError('Vérifiez le symbole, la quantité et le prix d’achat.');
      return;
    }
    setPositions(previous => [...previous, { id: `${Date.now()}-${Math.random()}`, ticker, qty, avg_price }]);
    setDraft({ ticker: '', qty: '', avg_price: '' });
    setError('');
  };

  const assets = result?.assets || positions.map(p => ({ ...p, quote_available: false }));
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="athar-panel p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="athar-tool-icon flex h-12 w-12 items-center justify-center rounded-xl"><Wallet size={22}/></div><div><h2 className="text-xl font-semibold">Mes positions</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enregistrées uniquement dans votre navigateur</p></div></div>
          <button onClick={() => setRevision(v => v + 1)} className="athar-icon-button" aria-label="Actualiser les cours" title="Actualiser" disabled={loading || !positions.length}><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
        </div>
        <form className="grid gap-3 sm:grid-cols-[minmax(120px,1fr)_minmax(100px,0.7fr)_minmax(130px,0.9fr)_auto] sm:items-end" onSubmit={addPosition}>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Symbole<input value={draft.ticker} onChange={e => setDraft(v => ({ ...v, ticker: e.target.value.toUpperCase() }))} placeholder="AAPL" maxLength={20} required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" /></label>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Quantité<input type="number" step="any" min="0.000001" value={draft.qty} onChange={e => setDraft(v => ({ ...v, qty: e.target.value }))} placeholder="10" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" /></label>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Prix d’achat unitaire<input type="number" step="any" min="0" value={draft.avg_price} onChange={e => setDraft(v => ({ ...v, avg_price: e.target.value }))} placeholder="150" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" /></label>
          <button type="submit" className="athar-primary-button h-[46px]"><Plus size={16}/> Ajouter</button>
        </form>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Saisissez les prix d’achat dans la devise de cotation de chaque actif. Les montants ne sont pas convertis entre devises.</p>
      </div>
      {error && <div role="alert" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"><AlertCircle size={18}/>{error}</div>}

      {result && Object.keys(result.totals_by_currency || {}).length > 0 && <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(result.totals_by_currency).map(([currency, total]) => <div key={currency} className="athar-panel p-6"><p className="text-xs text-slate-500 dark:text-slate-400">Valeur estimée · {currency}</p><p className="mt-2 text-2xl font-semibold tabular-nums">{displayNumber(total)} <span className="text-sm">{currency}</span></p></div>)}
      </div>}

      <section className="athar-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/10"><h3 className="font-semibold">Détail des investissements</h3><span className="text-xs text-slate-500">{positions.length} position(s)</span></div>
        {!positions.length ? <div className="p-12 text-center"><Wallet size={30} className="mx-auto mb-4 text-brand-gold"/><h4 className="font-semibold">Votre portefeuille est vide</h4><p className="mt-2 text-sm text-slate-500">Ajoutez votre premier actif pour commencer le suivi.</p></div> :
          <div className="divide-y divide-slate-100 dark:divide-white/10">{assets.map((item, index) =>
            <div key={item.id || index} className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">{item.ticker.slice(0,2)}</div>
              <div className="min-w-[90px] flex-1"><h4 className="font-semibold">{item.ticker}</h4><p className="mt-1 text-xs text-slate-500">{displayNumber(item.qty)} titres</p></div>
              <div className="min-w-[95px] text-right"><p className="text-xs text-slate-500">Cours</p><p className="mt-1 text-sm font-semibold tabular-nums">{displayNumber(item.current_price)} {item.currency || ''}</p></div>
              <div className="min-w-[110px] text-right"><p className="text-xs text-slate-500">Valorisation</p><p className="mt-1 text-sm font-semibold tabular-nums">{displayNumber(item.current_value)} {item.currency || ''}</p></div>
              <div className="min-w-[70px] text-right"><p className="text-xs text-slate-500">Gain / perte*</p><p className="mt-1 text-sm font-semibold tabular-nums">{item.gain_percent == null ? '—' : `${item.gain_percent > 0 ? '+' : ''}${displayNumber(item.gain_percent)}%`}</p></div>
              <button className="athar-icon-button" title="Supprimer cette position" aria-label={`Supprimer ${item.ticker}`} onClick={() => setPositions(v => v.filter(x => x.id !== item.id))}><Trash2 size={16}/></button>
            </div>)}</div>}
      </section>
      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400"><ArrowUpRight size={14} className="mt-0.5"/> Cotations Yahoo Finance potentiellement différées. *Gain estimé hors frais, fiscalité et variation de change. Une position sans cotation reste affichée sans valorisation inventée.</p>
    </div>
  );
}
