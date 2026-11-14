import React, { useEffect, useState } from 'react';
import { ArrowRight, CircleAlert, Heart, RefreshCw, Trash2 } from 'lucide-react';
import { apiRequest } from '../services/api';

const readWatchlist = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('myWatchlist') || '[]');
    return Array.isArray(saved) ? [...new Set(saved.filter(v => typeof v === 'string').map(v => v.toUpperCase()))] : [];
  } catch { return []; }
};
const display = (value, currency = '') => value == null ? '—' : `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value)} ${currency}`.trim();

export default function WatchlistModule({ onAnalyze }) {
  const [favorites, setFavorites] = useState(readWatchlist);
  const [quotes, setQuotes] = useState({});
  const [targets, setTargets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myPriceTargets') || '{}') || {}; }
    catch { return {}; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    try { localStorage.setItem('myWatchlist', JSON.stringify(favorites)); } catch { /* Storage disabled. */ }
  }, [favorites]);
  useEffect(() => {
    try { localStorage.setItem('myPriceTargets', JSON.stringify(targets)); } catch { /* Storage disabled. */ }
  }, [targets]);

  useEffect(() => {
    if (!favorites.length) { setQuotes({}); setError(''); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError('');
    apiRequest('/screening/analyze', { method: 'POST', body: JSON.stringify({ tickers: favorites.slice(0,12).join(',') }) })
      .then(body => { if (!cancelled) { setQuotes(Object.fromEntries((body.results || []).map(item => [item.ticker, item]))); if (body.errors?.length) setError(`${body.errors.length} actif(s) n’ont pas pu être actualisés.`); } })
      .catch(e => { if (!cancelled) setError(e.message || 'Cours indisponibles.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [favorites, revision]);

  const remove = symbol => setFavorites(list => list.filter(x => x !== symbol));

  return <div className="mx-auto max-w-6xl space-y-6 pb-12">
    <section className="athar-panel flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
      <div className="flex items-center gap-3"><div className="athar-tool-icon flex h-12 w-12 items-center justify-center rounded-xl"><Heart size={22}/></div><div><h2 className="text-xl font-semibold">Ma liste de suivi</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{favorites.length} actif(s) conservé(s) localement</p></div></div>
      <button className="athar-icon-button" disabled={!favorites.length || loading} onClick={() => setRevision(x => x + 1)} aria-label="Actualiser la liste" title="Actualiser"><RefreshCw size={17} className={loading ? 'animate-spin' : ''}/></button>
    </section>
    {error && <p role="status" className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"><CircleAlert size={18}/>{error}</p>}
    {!favorites.length ? <div className="athar-panel p-12 text-center"><Heart size={32} className="mx-auto mb-4 text-brand-gold"/><h3 className="font-semibold">Aucun actif suivi</h3><p className="mt-2 text-sm text-slate-500">Ajoutez des entreprises depuis l’analyse des actifs.</p><button onClick={() => onAnalyze('')} className="athar-primary-button mt-6">Ouvrir l’analyse <ArrowRight size={16}/></button></div> :
      <div className="grid gap-4 md:grid-cols-2">
        {favorites.map(symbol => {
          const item = quotes[symbol];
          const target = targets[symbol] ?? '';
          const current = item?.price;
          const reached = current != null && target !== '' && Number(target) > 0 && current <= Number(target);
          return <article key={symbol} className="athar-panel p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><p className="athar-eyebrow">{symbol}</p><h3 className="mt-1 text-lg font-semibold">{item?.name || symbol}</h3></div>
              <button className="athar-icon-button" title={`Retirer ${symbol}`} aria-label={`Retirer ${symbol}`} onClick={() => remove(symbol)}><Trash2 size={16}/></button>
            </div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/10">
              <div><p className="text-xs text-slate-500">Dernier cours</p><p className="mt-1 text-2xl font-semibold tabular-nums">{loading && !item ? 'Chargement…' : display(current, item?.currency)}</p></div>
              {item && <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${item.compliance?.status === 'potentially_compliant' ? 'bg-emerald-50 text-emerald-800' : item.compliance?.status === 'non_compliant' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>{item.compliance?.status === 'potentially_compliant' ? 'Filtrage favorable*' : item.compliance?.status === 'non_compliant' ? 'Critère(s) non rempli(s)' : 'Données insuffisantes'}</span>}
            </div>
            <label className="block text-xs font-medium text-slate-500">Alerte de prix indicative ({item?.currency || 'devise de cotation'})
              <input type="number" min="0" step="any" value={target} onChange={e => setTargets(v => ({...v, [symbol]: e.target.value}))} placeholder="Prix cible" className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" />
            </label>
            {reached && <p className="mt-2 text-xs font-semibold text-emerald-700">Le dernier cours reçu est inférieur ou égal à votre cible.</p>}
            <button onClick={() => onAnalyze(symbol)} className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-brand-gold dark:border-white/10">Consulter l’analyse <ArrowRight size={15}/></button>
          </article>;
        })}
      </div>}
    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">*Filtrage partiel et indicatif, pas une certification religieuse. Les cours peuvent être différés. Les cibles ne déclenchent pas de notifications en arrière-plan.</p>
  </div>;
}
