import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUpRight, ShieldCheck, TrendingUp, BookOpen,
  TrendingDown, ChevronRight, ChevronLeft, RefreshCw,
  Sparkles, BarChart2, Layers, GraduationCap, Star
} from 'lucide-react';

import { WISDOMS } from './ihsanData';

const API_URL = 'https://athar-api.onrender.com/api';

// ─── Geometric Islamic pattern (SVG) ─────────────────────────────────────────
function GeometricPattern({ opacity = 0.04, className = '' }) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="gp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#c5a059" strokeWidth="0.8" opacity={opacity * 25} />
          <polygon points="20,8 32,14 32,26 20,32 8,26 8,14" fill="none" stroke="#c5a059" strokeWidth="0.5" opacity={opacity * 15} />
          <circle cx="20" cy="20" r="2" fill="#c5a059" opacity={opacity * 20} />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#gp)" />
    </svg>
  );
}

// ─── Animated number ──────────────────────────────────────────────────────────
function FlipNumber({ value }) {
  const [displayed, setDisplayed] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value !== prev.current) {
      setDisplayed(value);
      prev.current = value;
    }
  }, [value]);
  return <span className="tabular-nums transition-all duration-500">{displayed}</span>;
}

// ─── Ticker tape ──────────────────────────────────────────────────────────────
function TickerTape({ items }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-brand-gold/10 bg-brand-dark/95 dark:bg-black/80 h-9 flex items-center">
      <div className="absolute left-0 z-10 h-full w-16 bg-gradient-to-r from-brand-dark dark:from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 z-10 h-full w-16 bg-gradient-to-l from-brand-dark dark:from-black to-transparent pointer-events-none" />
      <div
        className="flex gap-8 items-center whitespace-nowrap"
        style={{
          animation: 'ticker 40s linear infinite',
          willChange: 'transform',
        }}
      >
        {doubled.map((asset, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-gray-500 font-mono uppercase tracking-widest">{asset.symbol}</span>
            <span className="text-[11px] font-mono font-bold text-white">{asset.price?.toLocaleString('fr-FR')} $</span>
            <span className={`text-[9px] font-bold flex items-center gap-0.5 ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {asset.change >= 0 ? '▲' : '▼'} {Math.abs(asset.change)}%
            </span>
            <span className="text-brand-gold/20 text-xs">◆</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

// ─── Market Row ───────────────────────────────────────────────────────────────
function MarketRow({ asset }) {
  const up = asset.change >= 0;
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100/50 dark:border-white/5 last:border-0 group">
      <div className="flex items-center gap-2.5">
        <div className={`w-1.5 h-8 rounded-full ${up ? 'bg-emerald-400' : 'bg-red-400'} opacity-70`} />
        <div>
          <p className="text-[11px] font-bold text-gray-800 dark:text-white group-hover:text-brand-gold transition-colors leading-tight">
            {asset.name}
          </p>
          <p className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">{asset.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono font-bold text-gray-900 dark:text-white leading-tight">
          {asset.price?.toLocaleString('fr-FR')} $
        </p>
        <div className={`flex items-center justify-end gap-0.5 ${up ? 'text-emerald-500' : 'text-red-500'}`}>
          {up ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          <span className="text-[9px] font-bold">{asset.change > 0 ? '+' : ''}{asset.change}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Athar Carousel ───────────────────────────────────────────────────────────
function AtharCarousel({ onNavigate }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);
  const current = WISDOMS[index];

  const go = useCallback((dir) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex(i => (i + dir + WISDOMS.length) % WISDOMS.length);
      setAnimating(false);
    }, 200);
  }, [animating]);

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 10000);
    return () => clearInterval(timerRef.current);
  }, [go]);

  return (
    <div
      onClick={() => onNavigate('ihsan-data')}
      className="group relative rounded-3xl border border-brand-gold/25 hover:border-brand-gold/50 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/10"
      style={{ background: 'linear-gradient(145deg, #fffbf0 0%, #fefcf5 50%, #fff 100%)' }}
    >
      {/* Dark mode override */}
      <style>{`
        .dark .athar-card { background: linear-gradient(145deg, #1a1500 0%, #111000 50%, #0d0d0d 100%) !important; }
      `}</style>

      {/* Decorative quote mark */}
      <div className="absolute -bottom-4 -right-2 text-brand-gold/8 pointer-events-none select-none"
        style={{ fontSize: 120, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
        "
      </div>

      {/* Geometric pattern */}
      <GeometricPattern className="inset-0 w-full h-full" opacity={0.025} />

      <div className="relative z-10 p-6 flex flex-col min-h-[200px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Star size={10} className="fill-brand-gold text-brand-gold" />
            <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em]">Athar du Jour</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={e => { e.stopPropagation(); go(-1); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); go(1); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 flex flex-col justify-between"
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(6px)' : 'translateY(0)', transition: 'all 0.2s ease' }}
        >
          <p
            className="text-2xl text-gray-800 dark:text-gray-100 mb-3 leading-loose font-medium"
            dir="rtl"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {current?.arabic}
          </p>
          <div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 italic leading-relaxed line-clamp-2 mb-2">
              « {current?.french} »
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">— {current?.author}</p>
              <div className="flex gap-1">
                {WISDOMS.slice(0, Math.min(5, WISDOMS.length)).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === index % 5 ? 16 : 4,
                      height: 4,
                      background: i === index % 5 ? '#c5a059' : '#d1d5db',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tool Card ────────────────────────────────────────────────────────────────
const TOOL_COLORS = {
  gold: { bg: 'bg-brand-gold', text: 'text-white', glow: 'shadow-brand-gold/30' },
  emerald: { bg: 'bg-emerald-500', text: 'text-white', glow: 'shadow-emerald-500/30' },
  blue: { bg: 'bg-blue-500', text: 'text-white', glow: 'shadow-blue-500/30' },
  violet: { bg: 'bg-violet-500', text: 'text-white', glow: 'shadow-violet-500/30' },
};

function ToolCard({ title, sub, icon: Icon, onClick, delay, color = 'gold', badge }) {
  const c = TOOL_COLORS[color];
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left p-6 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-brand-gold/20 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm overflow-hidden animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${c.bg} blur-3xl`}
        style={{ opacity: 0, filter: 'blur(60px)', transform: 'scale(0.5)' }}
      />

      {badge && (
        <span className="absolute top-4 right-4 text-[9px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-2 py-0.5 uppercase tracking-widest">
          {badge}
        </span>
      )}

      <div className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center ${c.text} mb-5 shadow-lg ${c.glow} group-hover:scale-110 transition-all duration-300`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors mb-1 leading-tight">
        {title}
      </h3>
      <p className="text-[11px] text-gray-400 leading-snug mb-4">{sub}</p>

      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 dark:text-gray-600 group-hover:text-brand-gold transition-colors uppercase tracking-widest">
        Accéder <ArrowUpRight size={11} />
      </div>
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home({ onNavigate }) {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadMarketData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/market/live-prices`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMarketData(data);
        setError(false);
        setLastUpdated(new Date());
      } else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarketData();
    const t = setInterval(loadMarketData, 60000);
    return () => clearInterval(t);
  }, [loadMarketData]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="pb-24 animate-fade-in">

      {/* ── Ticker tape ──────────────────────────────────────────── */}
      {marketData.length > 0 && <TickerTape items={marketData} />}

      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d0d0d] shadow-2xl mt-6 transition-colors">

        {/* Background décor */}
        <GeometricPattern className="top-0 right-0 w-80 h-80 translate-x-1/4 -translate-y-1/4" opacity={0.035} />
        <div className="absolute bottom-0 left-0 w-96 h-64 rounded-full bg-brand-gold/3 blur-3xl pointer-events-none" />

        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16">

          {/* LEFT: Text + CTA */}
          <div className="flex-1 flex flex-col justify-center space-y-7">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-gold/8 text-brand-gold text-[9px] font-bold uppercase tracking-[0.2em] border border-brand-gold/20 mb-5">
                <Sparkles size={10} className="fill-brand-gold" />
                Tableau de Bord
              </span>

              <h1 className="text-4xl md:text-5xl xl:text-[3.5rem] font-display font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                L'Éthique<br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-500 to-brand-gold bg-[length:200%_100%]"
                    style={{ animation: 'shimmer 4s linear infinite' }}>
                    rencontre la
                  </span>
                  <br />Performance.
                </span>
              </h1>
              <style>{`
                @keyframes shimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
              `}</style>
            </div>

            {/* Hadith */}
            <blockquote className="flex gap-4 items-start">
              <div className="w-0.5 h-12 bg-gradient-to-b from-brand-gold to-brand-gold/0 rounded-full shrink-0 mt-1" />
              <p className="text-gray-500 dark:text-gray-400 text-base italic leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}>
                "La richesse de l'âme est la seule vraie richesse."
              </p>
            </blockquote>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => onNavigate('screener')}
                className="group flex items-center gap-2 px-7 py-3.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-gold/25 hover:-translate-y-0.5 hover:shadow-brand-gold/40 transition-all duration-300 text-sm"
              >
                <TrendingUp size={15} strokeWidth={2.5} />
                Scanner un actif
                <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('portfolio')}
                className="flex items-center gap-2 px-7 py-3.5 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 hover:border-brand-gold/30 hover:bg-white dark:hover:bg-white/8 font-bold rounded-2xl transition-all duration-300 text-sm hover:-translate-y-0.5"
              >
                <Layers size={15} strokeWidth={1.8} />
                Mon Portfolio
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100 dark:border-white/5">
              {[
                { v: '500+', l: 'Actifs analysés' },
                { v: '100%', l: 'Conformité Halal' },
                { v: 'Live', l: 'Données temps réel', accent: true },
              ].map(({ v, l, accent }) => (
                <div key={l}>
                  <p className={`text-xl font-bold ${accent ? 'text-emerald-500' : 'text-gray-900 dark:text-white'} leading-none mb-0.5`}>
                    {v}
                    {accent && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1.5 align-middle" />}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Widgets column */}
          <div className="w-full lg:w-[340px] xl:w-[380px] flex flex-col gap-4 shrink-0">

            {/* Athar */}
            <AtharCarousel onNavigate={onNavigate} />

            {/* Market widget */}
            <div className="flex-1 rounded-3xl border border-gray-100 dark:border-white/8 bg-gray-50/80 dark:bg-white/3 backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    loading ? 'bg-amber-400 animate-pulse' : error ? 'bg-red-500' : 'bg-emerald-400'
                  }`}
                    style={!loading && !error ? { boxShadow: '0 0 6px rgba(52,211,153,0.6)' } : {}}
                  />
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                    Marchés Sharia • Live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lastUpdated && (
                    <span className="text-[9px] text-gray-400 font-mono">{timeStr}</span>
                  )}
                  <button
                    onClick={loadMarketData}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-brand-gold transition-all"
                  >
                    <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 py-2">
                {loading ? (
                  <div className="space-y-3 py-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-8 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse" />
                          <div className="space-y-1.5">
                            <div className="h-2.5 w-20 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                            <div className="h-2 w-10 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-1.5 text-right">
                          <div className="h-3 w-16 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                          <div className="h-2 w-10 bg-gray-100 dark:bg-white/5 rounded animate-pulse ml-auto" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                      <TrendingDown size={18} className="text-red-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Flux interrompu</p>
                    <button
                      onClick={loadMarketData}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/5 transition-colors"
                    >
                      <RefreshCw size={10} /> Réactualiser
                    </button>
                  </div>
                ) : (
                  <div>
                    {marketData.map(asset => (
                      <MarketRow key={asset.symbol} asset={asset} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACCESS ─────────────────────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Accès rapide</h2>
          <div className="h-px flex-1 mx-4 bg-gray-100 dark:bg-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard
            title="Screener Pro"
            sub="Analyse Halal & financière complète"
            icon={TrendingUp}
            onClick={() => onNavigate('screener')}
            delay="0ms"
            color="gold"
            badge="Populaire"
          />
          <ToolCard
            title="Stock Battle"
            sub="Comparateur d'actifs côte-à-côte"
            icon={BarChart2}
            onClick={() => onNavigate('comparator')}
            delay="75ms"
            color="emerald"
          />
          <ToolCard
            title="Lifestyle"
            sub="Simulez vos objectifs de liberté"
            icon={ArrowUpRight}
            onClick={() => onNavigate('lifestyle')}
            delay="150ms"
            color="blue"
          />
          <ToolCard
            title="Académie"
            sub="Maîtrisez la finance islamique"
            icon={GraduationCap}
            onClick={() => onNavigate('academy')}
            delay="225ms"
            color="violet"
          />
        </div>
      </div>

      {/* ── FOOTER NOTE ──────────────────────────────────────────── */}
      <div className="mt-12 flex items-center justify-center gap-3 opacity-40">
        <div className="h-px w-16 bg-gray-300 dark:bg-white/20" />
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-semibold">
          Finance Éthique & Conforme
        </p>
        <div className="h-px w-16 bg-gray-300 dark:bg-white/20" />
      </div>
    </div>
  );
}
