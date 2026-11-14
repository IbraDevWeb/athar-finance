import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownRight, BarChart3, BookOpen, Activity, AlertCircle, RefreshCw, Scale, Search, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import { API_URL } from '../services/api';
import { WISDOMS } from './ihsanData';

const quickActions = [
  { id: 'screener', title: 'Analyser un actif', description: 'Finances et conformité', icon: Search },
  { id: 'chart', title: 'Suivre les marchés', description: 'Cours et graphiques', icon: Activity },
  { id: 'comparator', title: 'Comparer deux actions', description: 'Indicateurs côte à côte', icon: Scale },
  { id: 'simulator', title: 'Préparer un projet', description: 'Épargne et projections', icon: BarChart3 },
];
const money = (value, currency) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(number) + (currency ? ` ${currency}` : '');
};

export default function Home({ onNavigate }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [watchlistCount] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('myWatchlist') || '[]');
      return Array.isArray(saved) ? saved.length : 0;
    } catch { return 0; }
  });

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/market/live-prices`);
      const body = await response.json();
      if (!response.ok || !Array.isArray(body)) throw new Error(body.error || 'Flux indisponible');
      setQuotes(body);
      setUpdatedAt(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setError('');
    } catch (e) {
      setError(e.message || 'Cotations indisponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 120000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const wisdom = WISDOMS[wisdomIndex % Math.max(WISDOMS.length, 1)];

  return (
    <div className="space-y-8 pb-4">
      <section className="athar-hero overflow-hidden rounded-2xl">
        <div className="relative z-10 grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.4fr_0.6fr] lg:p-12">
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c7ad79]">Votre espace financier</p>
            <h1 className="max-w-[750px] text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[1.14] tracking-tight text-white">Investir avec méthode. <span className="text-[#d9c59e]">Avancer avec sérénité.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Retrouvez vos analyses, suivez les marchés et construisez votre stratégie patrimoniale dans un espace pensé pour la clarté.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('screener')} className="athar-primary-button">Analyser une entreprise <ArrowUpRight size={16} /></button>
              <button onClick={() => onNavigate('portfolio')} className="athar-secondary-button">Mon portefeuille <ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="hidden items-end justify-end lg:flex">
            <div className="w-full max-w-[230px] border-l border-white/15 pl-6 text-sm leading-6 text-slate-300">
              <ShieldCheck size={26} className="mb-5 text-[#d9c59e]" strokeWidth={1.5} />
              <strong className="block text-base font-semibold text-white">La transparence d’abord.</strong>
              <p className="mt-2">Les cours sont indicatifs et peuvent être différés selon les sources.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <OverviewCard label="Marchés suivis" value={loading ? '—' : String(quotes.length)} helper="Cotations disponibles" icon={Activity} />
        <OverviewCard label="Votre liste de suivi" value={String(watchlistCount)} helper="Actifs enregistrés sur cet appareil" icon={Wallet} />
        <OverviewCard label="Outils d’analyse" value="13" helper="Rubriques accessibles" icon={ShieldCheck} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
        <section className="athar-panel min-w-0">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-white/10">
            <div>
              <p className="athar-eyebrow">MARCHÉS</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Dernières cotations</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{updatedAt ? `Actualisation à ${updatedAt} · Données indicatives` : 'Cours selon disponibilité de la source'}</p>
            </div>
            <button title="Actualiser les cotations" aria-label="Actualiser les cotations" onClick={() => { setLoading(true); refresh(); }} className="athar-icon-button">
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="p-3 sm:p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 px-3 pb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <span>Actif</span><span className="text-right">Cours</span><span className="w-[72px] text-right">Variation</span>
            </div>
            {loading && !quotes.length && <div className="space-y-3">{[1,2,3].map(x => <div key={x} className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" />)}</div>}
            {quotes.map(quote => (
              <div key={quote.symbol} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 rounded-lg px-3 py-3.5 hover:bg-slate-50 dark:hover:bg-white/5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{quote.name}</div>
                  <div className="mt-1 text-[11px] font-medium text-slate-400">{quote.symbol}</div>
                </div>
                <div className="whitespace-nowrap text-right text-sm font-semibold tabular-nums">{money(quote.price, quote.currency)}</div>
                <span className={`flex w-[72px] items-center justify-end gap-1 whitespace-nowrap text-right text-xs font-semibold tabular-nums ${quote.change >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {quote.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(quote.change).toFixed(2)}%
                </span>
              </div>
            ))}
            {error && <div role="status" className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}{quotes.length > 0 ? ' · Dernières données reçues affichées.' : ''}</div>}
            {!loading && !quotes.length && !error && <p className="p-6 text-center text-sm text-slate-500">Aucune cotation disponible.</p>}
          </div>
          <button onClick={() => onNavigate('chart')} className="flex w-full items-center justify-between border-t border-slate-100 px-6 py-4 text-xs font-semibold text-brand-gold transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
            Ouvrir le terminal de marché <ArrowRight size={16} />
          </button>
        </section>

        <section className="athar-panel flex flex-col overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-white/10">
            <p className="athar-eyebrow">RÉFLEXION</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">Un instant de sagesse</h2>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-8 p-6">
            {wisdom ? <div>
              <Sparkles size={25} strokeWidth={1.5} className="mb-7 text-brand-gold" />
              <p className="text-right font-serif text-[23px] leading-loose" dir="rtl">{wisdom.arabic}</p>
              <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">« {wisdom.french} »</p>
              <p className="mt-4 text-xs font-semibold text-brand-gold">{wisdom.author}</p>
            </div> : <p className="text-sm text-slate-500">Aucune citation disponible.</p>}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
              <button onClick={() => onNavigate('ihsan-data')} className="text-xs font-semibold text-brand-gold">Explorer les enseignements</button>
              <button aria-label="Citation suivante" title="Citation suivante" className="athar-icon-button" onClick={() => setWisdomIndex(i => i + 1)}><ArrowRight size={17} /></button>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div><p className="athar-eyebrow">ACCÈS RAPIDE</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Vos outils essentiels</h2></div>
          <button onClick={() => onNavigate('academy')} className="hidden items-center gap-2 text-xs font-semibold text-brand-gold sm:flex">L’académie <BookOpen size={16} /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ id, title, description, icon: Icon }) => (
            <button key={id} onClick={() => onNavigate(id)} className="athar-tool-card group flex min-h-40 flex-col items-start justify-between p-5 text-left">
              <div className="flex w-full items-center justify-between">
                <div className="athar-tool-icon flex h-10 w-10 items-center justify-center rounded-lg"><Icon size={20} strokeWidth={1.7} /></div>
                <ArrowUpRight size={17} className="text-slate-400 transition-colors group-hover:text-brand-gold" />
              </div>
              <div className="mt-5"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p></div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function OverviewCard({ label, value, helper, icon: Icon }) {
  return <div className="athar-panel flex items-center justify-between gap-3 p-5 sm:p-6">
    <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-[11px] text-slate-400">{helper}</p></div>
    <div className="athar-tool-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"><Icon size={20} strokeWidth={1.7} /></div>
  </div>;
}
