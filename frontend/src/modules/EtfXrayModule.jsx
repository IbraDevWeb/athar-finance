import React, { useState } from 'react';
import { ArrowRight, ChartPie, CircleAlert, Layers, Search } from 'lucide-react';
import { screeningService } from '../services/api';

export default function EtfXrayModule() {
  const [ticker, setTicker] = useState('SPUS');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async (event) => {
    event.preventDefault();
    if (!ticker.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await screeningService.scanEtf(ticker.trim().toUpperCase()));
    } catch (e) { setError(e.message || 'Analyse momentanément indisponible.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="athar-panel p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="athar-tool-icon flex h-12 w-12 items-center justify-center rounded-xl"><Layers size={24} /></div>
          <div><h2 className="text-xl font-semibold">Analyse des ETF</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Composition et répartition sectorielle, selon la disponibilité de FMP.</p></div>
        </div>
        <form onSubmit={analyze} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="etf-ticker" className="sr-only">Symbole du fonds</label>
          <input id="etf-ticker" maxLength={20} value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="Ex. : SPUS, HLAL, SPY" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-gold" />
          <button className="athar-primary-button" type="submit" disabled={loading}><Search size={16} /> {loading ? 'Analyse…' : 'Analyser le fonds'}</button>
        </form>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Certaines données de composition nécessitent un abonnement fournisseur. Une donnée manquante n’est jamais estimée.</p>
      </div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"><CircleAlert size={18} />{error}</div>}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="athar-panel flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
            <div><p className="athar-eyebrow">{result.ticker}</p><h3 className="mt-2 text-2xl font-semibold">{result.name}</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-300">{result.description || 'Aucune description publiée par la source.'}</p></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="athar-panel p-6">
              <div className="mb-5 flex items-center gap-2"><Layers size={18} className="text-brand-gold" /><h3 className="font-semibold">Principales positions</h3></div>
              {result.holdings?.length ? <div className="space-y-5">{result.holdings.map((h, i) => <div key={i}>
                <div className="mb-2 flex justify-between gap-4 text-sm"><span className="truncate">{h.name}</span><span className="font-semibold tabular-nums">{h.percent.toFixed(2)}%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-[#a78b5e]" style={{ width: `${Math.max(0, Math.min(100, h.percent))}%` }} /></div>
              </div>)}</div> : <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-300">{result.holdings_notice || 'Positions non communiquées par la source.'}</p>}
            </section>
            <section className="athar-panel p-6">
              <div className="mb-5 flex items-center gap-2"><ChartPie size={18} className="text-brand-gold" /><h3 className="font-semibold">Répartition sectorielle</h3></div>
              {result.sectors?.length ? <div className="space-y-5">{result.sectors.map((s, i) => <div key={i}>
                <div className="mb-2 flex justify-between gap-4 text-sm"><span className="truncate">{s.name}</span><span className="font-semibold tabular-nums">{s.value.toFixed(2)}%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-[#2b6074]" style={{ width: `${Math.max(0, Math.min(100, s.value))}%` }} /></div>
              </div>)}</div> : <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-300">{result.sectors_notice || 'Répartition indisponible.'}</p>}
            </section>
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><ArrowRight size={13} /> Source : Financial Modeling Prep. Composition non garantie en temps réel. Aucun verdict de conformité automatique.</p>
        </div>
      )}
    </div>
  );
}
