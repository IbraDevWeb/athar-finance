import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import {
  Home, Building, TrendingUp, AlertCircle, CheckCircle,
  Scale, ArrowRight, Info, ChevronDown, ChevronUp, Zap
} from 'lucide-react';

// ─── Animated Counter ───────────────────────────────────────────────────────
function AnimatedValue({ value, formatter }) {
  const [displayed, setDisplayed] = useState(value);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const duration = 600;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else {
        fromRef.current = to;
        startRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <span>{formatter(displayed)}</span>;
}

// ─── Slider with live fill ──────────────────────────────────────────────────
function SliderInput({ label, value, setValue, min, max, step, format, hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
        <span className="text-sm font-bold text-brand-dark tabular-nums">{format(value)}</span>
      </div>
      <div className="relative h-2 group">
        <div className="absolute inset-0 rounded-full bg-gray-100" />
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-brand-dark transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-dark border-2 border-white shadow-md transition-all duration-150 pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      {hint && <p className="text-[10px] text-gray-400 leading-tight">{hint}</p>}
    </div>
  );
}

// ─── Section collapse ───────────────────────────────────────────────────────
function Section({ title, icon, accentColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-2xl overflow-hidden" style={{ borderTop: `3px solid ${accentColor}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: accentColor }}>{icon}</span>
          <span className="font-bold text-xs uppercase tracking-widest text-gray-600">{title}</span>
        </div>
        <span className="text-gray-400">{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-xl min-w-[200px]">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-gray-500">{p.name}</span>
          </div>
          <span className="text-sm font-bold text-gray-800 tabular-nums">{formatter(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
          <span className="text-xs text-gray-400">Écart</span>
          <span className={`text-xs font-bold ${payload[0].value > payload[1].value ? 'text-brand-dark' : 'text-brand-gold'}`}>
            {formatter(Math.abs(payload[0].value - payload[1].value))}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HouseModule() {

  // ── Params ──
  const [propertyPrice, setPropertyPrice]           = useState(250000);
  const [downPayment, setDownPayment]               = useState(50000);
  const [years, setYears]                           = useState(25);
  const [mortgageRate, setMortgageRate]             = useState(3.8);
  const [propertyAppreciation, setPropertyAppreciation] = useState(2);
  const [propertyTax, setPropertyTax]               = useState(1200);
  const [maintenanceCost, setMaintenanceCost]       = useState(1);
  const [rent, setRent]                             = useState(900);
  const [marketReturn, setMarketReturn]             = useState(8);

  // ── Results ──
  const [data, setData]           = useState([]);
  const [winner, setWinner]       = useState('buy');
  const [diffAmount, setDiffAmount] = useState(0);
  const [breakevenYear, setBreakevenYear] = useState(null);
  const [monthlyMortgage, setMonthlyMortgage] = useState(0);
  const [monthlyOwnerTotal, setMonthlyOwnerTotal] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [notaryFees, setNotaryFees] = useState(0);
  const [finalOwner, setFinalOwner] = useState(0);
  const [finalRenter, setFinalRenter] = useState(0);

  const formatMoney = useCallback((val) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val), []);
  const formatK = useCallback((val) => {
    const abs = Math.abs(val);
    return (val < 0 ? '-' : '') + (abs >= 1000 ? `${Math.round(abs / 1000)}k€` : `${Math.round(abs)}€`);
  }, []);

  useEffect(() => {
    const fees = propertyPrice * 0.08;
    const loan = propertyPrice + fees - downPayment;
    const mr = mortgageRate / 100 / 12;
    const np = years * 12;
    const mm = loan > 0 ? (loan * mr) / (1 - Math.pow(1 + mr, -np)) : 0;
    const monthlyOwner = mm + (propertyTax / 12) + ((propertyPrice * (maintenanceCost / 100)) / 12);

    setNotaryFees(fees);
    setLoanAmount(loan);
    setMonthlyMortgage(mm);
    setMonthlyOwnerTotal(monthlyOwner);

    const chartData = [];
    let ownerWealth = downPayment - fees;
    let renterWealth = downPayment;
    let currentPropertyPrice = propertyPrice;
    let remainingDebt = loan;
    let currentRent = rent;
    let crossoverYear = null;
    let prevOwnerAhead = ownerWealth >= renterWealth;

    for (let year = 1; year <= years; year++) {
      currentPropertyPrice *= (1 + propertyAppreciation / 100);
      for (let m = 0; m < 12; m++) {
        const interest = remainingDebt * mr;
        const capital = mm - interest;
        remainingDebt = Math.max(0, remainingDebt - capital);
      }
      ownerWealth = currentPropertyPrice - remainingDebt;

      const monthlySavings = monthlyOwner - currentRent;
      for (let m = 0; m < 12; m++) {
        renterWealth *= (1 + marketReturn / 100 / 12);
        renterWealth += monthlySavings;
      }
      currentRent *= 1.02;

      const ownerAhead = ownerWealth >= renterWealth;
      if (!crossoverYear && !ownerAhead && prevOwnerAhead) crossoverYear = year;
      if (!crossoverYear && ownerAhead && !prevOwnerAhead) crossoverYear = year;
      prevOwnerAhead = ownerAhead;

      chartData.push({
        year: `An ${year}`,
        Acheteur: Math.round(ownerWealth),
        Locataire: Math.round(renterWealth),
      });
    }

    setData(chartData);
    setBreakevenYear(crossoverYear);

    const fo = chartData[chartData.length - 1].Acheteur;
    const fr = chartData[chartData.length - 1].Locataire;
    setFinalOwner(fo);
    setFinalRenter(fr);
    if (fo > fr) { setWinner('buy'); setDiffAmount(fo - fr); }
    else          { setWinner('rent'); setDiffAmount(fr - fo); }
  }, [propertyPrice, downPayment, years, mortgageRate, propertyAppreciation, propertyTax, maintenanceCost, rent, marketReturn]);

  const isBuy = winner === 'buy';

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-24 px-2">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="text-center pt-10 pb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-dark/5 border border-brand-dark/10 text-brand-dark mb-1">
          <Scale size={28} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark tracking-tight">
          Acheter <span className="text-brand-gold">vs</span> Louer
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          Simulation mathématique complète — chaque centime compté, chaque année modélisée.
          Ajustez les paramètres pour trouver votre vérité financière.
        </p>
      </div>

      {/* ── VERDICT BANNER ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl mb-8 transition-all duration-700"
        style={{ background: isBuy ? '#1e293b' : 'linear-gradient(135deg, #c5a059, #e8c07e)' }}
      >
        {/* decorative circle */}
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: isBuy ? '#c5a059' : '#fff' }}
        />
        <div
          className="absolute -left-8 -bottom-12 w-48 h-48 rounded-full opacity-5"
          style={{ background: isBuy ? '#fff' : '#1e293b' }}
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-7 md:p-8">
          {/* left */}
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              {isBuy ? <Home size={18} className="opacity-70" /> : <TrendingUp size={18} className="opacity-70" />}
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">Verdict mathématique après {years} ans</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
              {isBuy ? "L'achat immobilier l'emporte" : "La stratégie bourse l'emporte"}
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-sm leading-relaxed">
              {isBuy
                ? "La plus-value immobilière et l'épargne forcée du crédit dominent les marchés sur cette période."
                : "En plaçant l'apport et la différence mensuelle, le locataire génère plus de patrimoine net."}
            </p>
          </div>

          {/* right — KPIs */}
          <div className="flex gap-3 shrink-0">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[140px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Avantage final</p>
              <p className="text-2xl font-mono font-bold text-white tabular-nums">
                +<AnimatedValue value={diffAmount} formatter={formatK} />
              </p>
            </div>
            {breakevenYear && (
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[130px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Crossover</p>
                <p className="text-2xl font-mono font-bold text-white">An {breakevenYear}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* LEFT: Controls */}
        <div className="lg:col-span-4 space-y-4">

          {/* DURÉE */}
          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-brand-gold" />
              <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Durée de simulation</span>
            </div>
            <SliderInput
              label="Horizon temporel" value={years} setValue={setYears}
              min={5} max={30} step={1}
              format={v => `${v} ans`}
            />
          </div>

          {/* ACHAT */}
          <Section title="Hypothèses Achat" icon={<Home size={16} />} accentColor="#1e293b">
            <SliderInput
              label="Prix du bien" value={propertyPrice} setValue={setPropertyPrice}
              min={80000} max={1000000} step={5000}
              format={v => formatMoney(v)}
            />

            {/* Frais notaire inline */}
            <div className="flex justify-between items-center bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Frais de notaire (8%)</span>
              <span className="text-xs font-bold text-red-500">− {formatMoney(notaryFees)}</span>
            </div>

            <SliderInput
              label="Apport personnel" value={downPayment} setValue={setDownPayment}
              min={0} max={Math.round(propertyPrice * 0.5)} step={1000}
              format={v => formatMoney(v)}
              hint={`Soit ${Math.round((downPayment / propertyPrice) * 100)}% du prix`}
            />
            <SliderInput
              label="Taux crédit (assurance incluse)" value={mortgageRate} setValue={setMortgageRate}
              min={1} max={7} step={0.05}
              format={v => `${v.toFixed(2)}%`}
            />
            <SliderInput
              label="Taxe foncière / an" value={propertyTax} setValue={setPropertyTax}
              min={0} max={5000} step={50}
              format={v => formatMoney(v)}
            />
            <SliderInput
              label="Entretien / an" value={maintenanceCost} setValue={setMaintenanceCost}
              min={0} max={3} step={0.1}
              format={v => `${v.toFixed(1)}% du bien`}
              hint={`≈ ${formatMoney(propertyPrice * maintenanceCost / 100)} / an`}
            />
            <SliderInput
              label="Valorisation annuelle du bien" value={propertyAppreciation} setValue={setPropertyAppreciation}
              min={-1} max={6} step={0.25}
              format={v => `+${v.toFixed(2)}%`}
            />
          </Section>

          {/* LOCATION */}
          <Section title="Hypothèses Location" icon={<Building size={16} />} accentColor="#c5a059">
            <SliderInput
              label="Loyer mensuel (CC)" value={rent} setValue={setRent}
              min={300} max={5000} step={25}
              format={v => formatMoney(v)}
              hint="Indexé à +2% / an (IRL)"
            />
            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-2xl p-4">
              <SliderInput
                label="Rendement bourse (ETF)" value={marketReturn} setValue={setMarketReturn}
                min={2} max={15} step={0.5}
                format={v => `${v}% / an`}
                hint="Le locataire DOIT investir la différence de coût chaque mois."
              />
            </div>
          </Section>
        </div>

        {/* RIGHT: Chart + KPIs */}
        <div className="lg:col-span-8 space-y-5">

          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
              label="Mensualité crédit"
              value={<AnimatedValue value={Math.round(monthlyMortgage)} formatter={v => formatMoney(v)} />}
              sub="hors charges"
              accent="#1e293b"
            />
            <KpiCard
              label="Coût total propriétaire"
              value={<AnimatedValue value={Math.round(monthlyOwnerTotal)} formatter={v => formatMoney(v)} />}
              sub="crédit + foncier + entretien"
              accent="#ef4444"
            />
            <KpiCard
              label="Patrimoine propriétaire"
              value={<AnimatedValue value={finalOwner} formatter={formatK} />}
              sub={`dans ${years} ans`}
              accent="#1e293b"
            />
            <KpiCard
              label="Patrimoine locataire"
              value={<AnimatedValue value={finalRenter} formatter={formatK} />}
              sub={`dans ${years} ans`}
              accent="#c5a059"
            />
          </div>

          {/* Chart */}
          <div className="glass p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-sm text-gray-700">Évolution du patrimoine net</h3>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {[
                { color: '#1e293b', label: 'Propriétaire', dash: false },
                { color: '#c5a059', label: 'Locataire (bourse)', dash: true },
              ].map(({ color, label, dash }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <svg width="24" height="10">
                    {dash
                      ? <line x1="0" y1="5" x2="24" y2="5" stroke={color} strokeWidth="2.5" strokeDasharray="6 3" />
                      : <line x1="0" y1="5" x2="24" y2="5" stroke={color} strokeWidth="2.5" />}
                  </svg>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
              {breakevenYear && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="w-3 h-px border-t-2 border-dashed border-gray-300" style={{ width: 20 }} />
                  <span className="text-[10px] text-gray-400">Croisement An {breakevenYear}</span>
                </div>
              )}
            </div>

            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gRent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c5a059" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#c5a059" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="year" tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => v.replace('An ', '')}
                    label={{ value: 'Années', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }}
                  />
                  <YAxis
                    tickFormatter={v => formatK(v)} tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false} tickLine={false} width={52}
                  />
                  <Tooltip
                    content={<CustomTooltip formatter={formatMoney} />}
                  />
                  {breakevenYear && (
                    <ReferenceLine
                      x={`An ${breakevenYear}`}
                      stroke="#d1d5db"
                      strokeDasharray="5 3"
                      label={{ value: `⇄ An ${breakevenYear}`, position: 'top', fontSize: 9, fill: '#9ca3af' }}
                    />
                  )}
                  <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
                  <Area
                    name="Propriétaire" type="monotone" dataKey="Acheteur"
                    stroke="#1e293b" strokeWidth={2.5}
                    fillOpacity={1} fill="url(#gBuy)"
                    dot={false} activeDot={{ r: 5, fill: '#1e293b', strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area
                    name="Locataire (bourse)" type="monotone" dataKey="Locataire"
                    stroke="#c5a059" strokeWidth={2.5} strokeDasharray="8 3"
                    fillOpacity={1} fill="url(#gRent)"
                    dot={false} activeDot={{ r: 5, fill: '#c5a059', strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid md:grid-cols-3 gap-3">
            <InfoCard
              icon={<AlertCircle size={16} className="text-red-400" />}
              title="Le piège des frais"
              text={`${formatMoney(notaryFees)} de frais de notaire perdus dès le premier jour. Il faut souvent 5 à 8 ans pour effacer ce handicap initial.`}
              bg="bg-red-50" border="border-red-100"
            />
            <InfoCard
              icon={<CheckCircle size={16} className="text-emerald-500" />}
              title="Intérêts composés"
              text={`À ${marketReturn}% / an, chaque euro investi double en ${Math.round(72 / marketReturn)} ans. Le temps est le meilleur allié du locataire investisseur.`}
              bg="bg-emerald-50" border="border-emerald-100"
            />
            <InfoCard
              icon={<Info size={16} className="text-blue-400" />}
              title="Le vrai coût mensuel"
              text={`Le propriétaire débourse ${formatMoney(monthlyOwnerTotal)}/mois (crédit + charges). Le locataire paie ${formatMoney(rent)} et investit le reste.`}
              bg="bg-blue-50" border="border-blue-100"
            />
          </div>

          {/* Loan summary */}
          <div className="glass rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Récapitulatif du financement</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { k: 'Montant emprunté',      v: formatMoney(loanAmount) },
                { k: 'Frais de notaire',      v: formatMoney(notaryFees) },
                { k: 'Mensualité',            v: `${formatMoney(monthlyMortgage)}/mois` },
                { k: 'Coût total du crédit',  v: formatMoney(Math.max(0, monthlyMortgage * years * 12 - loanAmount)) },
              ].map(({ k, v }) => (
                <div key={k} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{k}</p>
                  <p className="font-bold text-brand-dark tabular-nums text-base">{v}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── InfoCard ────────────────────────────────────────────────────────────────
function InfoCard({ icon, title, text, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-4 flex gap-3`}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-sm text-gray-700 mb-1">{title}</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
