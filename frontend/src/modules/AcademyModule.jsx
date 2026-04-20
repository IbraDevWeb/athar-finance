import React, { useState, useEffect, useRef } from 'react';
// Import your data — fallback mock data is provided below if AcademyData is unavailable
import { courses, glossary, quizData } from './AcademyData';
import {
  GraduationCap, Hourglass, Globe, Search, FileText,
  BookOpen, ChevronRight, CheckCircle, XCircle, Trophy,
  BrainCircuit, Library, Clock, Star, Sparkles, ScrollText,
  ChevronDown, RotateCcw, Award, Flame
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — Cohérent avec Athar landing
───────────────────────────────────────────── */
const T = {
  ink:      '#080807',
  ink2:     '#111110',
  ink3:     '#1c1b19',
  gold:     '#c5a059',
  goldLt:   '#e2c98a',
  goldDk:   '#9a7a3f',
  cream:    '#f5efe0',
  cream2:   '#ede4cf',
  muted:    'rgba(197,160,89,.4)',
  dimText:  'rgba(245,239,224,.45)',
  border:   'rgba(197,160,89,.12)',
  borderHover: 'rgba(197,160,89,.35)',
};

const style = {
  fontDisplay: "'Cormorant Garamond', Georgia, serif",
  fontBody:    "'Jost', sans-serif",
};

/* Inject Google Fonts once */
const injectFonts = () => {
  if (document.getElementById('athar-fonts')) return;
  const link = document.createElement('link');
  link.id   = 'athar-fonts';
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
};

/* ─────────────────────────────────────────────
   MOCK DATA (utilisé si AcademyData absent)
───────────────────────────────────────────── */
const mockCourses = [
  { id:1, title:'Fondamentaux de la Finance Islamique', summary:'Découvrez les principes fondateurs — Riba, Gharar, Maysir — et pourquoi ils façonnent chaque décision d\'investissement.', content:<p>La finance islamique repose sur l'interdiction du <strong>Riba</strong> (intérêt), du <strong>Gharar</strong> (incertitude excessive) et du <strong>Maysir</strong> (spéculation). Ces principes orientent vers un partage juste des profits et des risques entre toutes les parties.</p> },
  { id:2, title:'Screener & Analyse Charia', summary:'Apprenez à évaluer la conformité d\'une action en 3 étapes : activité, ratios financiers, revenus impurs.', content:<p>L'analyse Charia d'une action suit un processus en deux temps : d'abord l'<strong>écran sectoriel</strong> (exclure tabac, alcool, armes, etc.), puis l'<strong>écran financier</strong> (ratios de dette, de liquidités, revenus impurs &lt;5%).</p> },
  { id:3, title:'Construire un Portefeuille Halal', summary:'Diversification, allocation d\'actifs et rééquilibrage — les clés d\'un portefeuille robuste et conforme.', content:<p>Un portefeuille Halal bien construit combine <strong>actions conformes</strong>, <strong>Sukuk</strong> (obligations islamiques) et <strong>matières premières</strong>. La règle d'or : diversifier sans jamais sacrifier la conformité pour la performance.</p> },
  { id:4, title:'ETF Islamiques & Sukuk', summary:'Maîtrisez les véhicules d\'investissement collectifs conformes : iShares MSCI World Islamic, AMANAH, Sukuk souverains.', content:<p>Les <strong>ETF islamiques</strong> répliquent des indices filtrés (MSCI World Islamic, S&P 500 Shariah). Les <strong>Sukuk</strong> sont des certificats d'investissement adossés à des actifs réels, offrant un rendement sans intérêt conventionnel.</p> },
];

const mockGlossary = [
  { term:'Riba', def:'Intérêt ou usure. Toute augmentation injustifiée du capital, strictement interdite en Islam.' },
  { term:'Sukuk', def:'Certificats d\'investissement islamiques, équivalents des obligations mais adossés à des actifs tangibles.' },
  { term:'Gharar', def:'Incertitude excessive ou ambiguïté dans un contrat. Rend une transaction non conforme à la Charia.' },
  { term:'Zakat', def:'Troisième pilier de l\'Islam. Purification obligatoire de la richesse au taux de 2,5% sur les actifs zakatable.' },
  { term:'Murabaha', def:'Vente à coût majoré. Mode de financement où la banque achète un bien puis le revend à prix majoré, sans intérêt.' },
  { term:'Ijara', def:'Contrat de location islamique, équivalent du leasing. L\'usage est loué, non le capital.' },
  { term:'Musharaka', def:'Partenariat islamique avec partage des profits ET des pertes selon les apports de chaque partie.' },
  { term:'Maysir', def:'Spéculation ou jeu de hasard. Interdit car il crée de la richesse sans valeur ajoutée réelle.' },
  { term:'Purification', def:'Processus de don caritatif des revenus impurs (dividendes de sources non conformes) pour purifier le portefeuille.' },
  { term:'Nisab', def:'Seuil minimum de richesse à partir duquel la Zakat devient obligatoire (équivalent de 85g d\'or).' },
  { term:'Halal', def:'Ce qui est permis selon la loi islamique. En finance, désigne les instruments et activités conformes à la Charia.' },
  { term:'Takaful', def:'Assurance islamique basée sur la solidarité mutuelle et le partage des risques entre participants.' },
];

const mockQuiz = [
  { question:'Quel terme désigne l\'interdiction des intérêts en finance islamique ?', options:['Gharar','Riba','Maysir','Zakat'], correct:1 },
  { question:'Quel ratio financier est central dans l\'écran Charia d\'une action ?', options:['P/E Ratio','Ratio de liquidité','Ratio de dette sur capitalisation','Marge bénéficiaire'], correct:2 },
  { question:'Les Sukuk sont comparables à quel instrument conventionnel ?', options:['Actions','Options','Obligations','ETF'], correct:2 },
  { question:'Quel est le taux standard de la Zakat sur les actifs financiers ?', options:['1%','2,5%','5%','10%'], correct:1 },
  { question:'La Musharaka implique nécessairement…', options:['Un taux d\'intérêt fixe','Le partage des profits uniquement','Le partage des profits ET des pertes','Une vente à terme'], correct:2 },
];

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
export default function AcademyModule() {
  const [activeTab, setActiveTab] = useState('lessons');
  const coursesData  = typeof courses  !== 'undefined' ? courses  : mockCourses;
  const glossaryData = typeof glossary !== 'undefined' ? glossary : mockGlossary;
  const quizDataSet  = typeof quizData !== 'undefined' ? quizData : mockQuiz;

  useEffect(() => { injectFonts(); }, []);

  const tabs = [
    { id:'lessons',  label:'Cours',     sublabel:'& Modules',  icon:Library    },
    { id:'glossary', label:'Glossaire', sublabel:'Fiqh',       icon:ScrollText },
    { id:'quiz',     label:'Quiz',      sublabel:'Express',    icon:BrainCircuit },
  ];

  return (
    <div style={{
      background: T.ink,
      minHeight: '100vh',
      fontFamily: style.fontBody,
      fontWeight: 300,
      color: T.cream,
      padding: '2rem',
    }}>

      {/* ── HEADER ── */}
      <Header coursesData={coursesData} quizDataSet={quizDataSet} />

      {/* ── TABS ── */}
      <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ── CONTENT ── */}
      <ContentArea key={activeTab} activeTab={activeTab}
        coursesData={coursesData} glossaryData={glossaryData} quizDataSet={quizDataSet} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header({ coursesData, quizDataSet }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      border: `1px solid ${T.border}`,
      marginBottom: '2px',
      background: T.ink2,
      padding: '3.5rem 3rem 3rem',
    }}>
      {/* Geometric SVG */}
      <svg style={{ position:'absolute', top:'-60px', right:'-60px', width:'420px', height:'420px', opacity:.045, pointerEvents:'none' }}
           viewBox="0 0 400 400" fill="none" stroke={T.gold} strokeWidth=".8">
        <g transform="translate(200,200)">
          {[80,130,180,230].map(r => <circle key={r} r={r} opacity={r===80?'.8':'.5'} />)}
          <polygon points="0,-170 20,-52 93,-93 52,-20 170,0 52,20 93,93 20,52 0,170 -20,52 -93,93 -52,20 -170,0 -52,-20 -93,-93 -20,-52" />
          <polygon points="0,-120 14,-37 66,-66 37,-14 120,0 37,14 66,66 14,37 0,120 -14,37 -66,66 -37,14 -120,0 -37,-14 -66,-66 -14,-37" opacity=".6"/>
          {[0,45,90,135].map(a => {
            const rad = a * Math.PI/180;
            return <line key={a} x1={Math.cos(rad)*-220} y1={Math.sin(rad)*-220} x2={Math.cos(rad)*220} y2={Math.sin(rad)*220} opacity=".3" />;
          })}
        </g>
      </svg>

      {/* Gold glow */}
      <div style={{
        position:'absolute', width:'500px', height:'400px', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(197,160,89,.12) 0%, transparent 70%)',
        top:'-100px', right:'-50px', pointerEvents:'none',
      }} />

      <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem' }}>
        <div>
          {/* Eyebrow */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'.5rem',
            background:'rgba(197,160,89,.08)',
            border:`1px solid ${T.border}`,
            borderRadius:'3px', padding:'.3rem .9rem',
            fontSize:'.65rem', fontWeight:600,
            letterSpacing:'.2em', textTransform:'uppercase',
            color: T.gold, marginBottom:'1.4rem',
          }}>
            <GraduationCap size={12} />
            Zone d'apprentissage
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: style.fontDisplay,
            fontSize:'clamp(2.6rem, 5vw, 4rem)',
            fontWeight:300, lineHeight:1.08,
            color: T.cream, marginBottom:'.8rem',
          }}>
            Académie <em style={{ fontStyle:'italic', color:T.gold }}>Athar</em>
          </h1>

          {/* Quote */}
          <p style={{
            fontFamily: style.fontDisplay,
            fontStyle:'italic', fontWeight:300,
            fontSize:'1.05rem', color:T.dimText,
            borderLeft:`2px solid ${T.goldDk}`,
            paddingLeft:'1rem', maxWidth:'480px',
          }}>
            "Le savoir précède la parole et l'action." — Imam Al-Bukhārī
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:'1px', background:T.border, border:`1px solid ${T.border}`, borderRadius:'6px', overflow:'hidden' }}>
          {[
            { num: coursesData.length,  label:'Modules'   },
            { num: quizDataSet.length,  label:'Questions' },
            { num: '12K+',              label:'Membres'   },
          ].map(({ num, label }) => (
            <div key={label} style={{
              background: T.ink3, padding:'1.4rem 2rem',
              textAlign:'center', minWidth:'90px',
            }}>
              <div style={{ fontFamily:style.fontDisplay, fontSize:'2rem', fontWeight:400, color:T.gold, lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:'.6rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:T.dimText, marginTop:'.3rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB NAVIGATION
───────────────────────────────────────────── */
function TabNav({ tabs, activeTab, setActiveTab }) {
  return (
    <div style={{
      display:'flex', gap:'1px',
      background: T.border,
      border:`1px solid ${T.border}`,
      borderTop:'none',
      borderRadius:'0 0 6px 6px',
      overflow:'hidden',
      marginBottom:'2rem',
    }}>
      {tabs.map(({ id, label, sublabel, icon:Icon }) => {
        const active = activeTab === id;
        return (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.7rem',
            padding:'1rem 1.5rem',
            background: active ? T.ink3 : T.ink2,
            border:'none', cursor:'pointer',
            fontFamily: style.fontBody,
            color: active ? T.gold : T.dimText,
            transition:'all .25s',
            position:'relative',
            outline:'none',
          }}>
            {active && (
              <div style={{
                position:'absolute', bottom:0, left:'10%', right:'10%', height:'2px',
                background:`linear-gradient(to right, transparent, ${T.gold}, transparent)`,
              }} />
            )}
            <Icon size={15} />
            <span style={{ fontWeight:500, letterSpacing:'.1em', fontSize:'.78rem', textTransform:'uppercase' }}>
              {label}
            </span>
            <span style={{ fontSize:'.68rem', color:T.dimText, display:'none' }}>{sublabel}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTENT AREA (fade-in transition)
───────────────────────────────────────────── */
function ContentArea({ activeTab, coursesData, glossaryData, quizDataSet }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition:'opacity .45s ease, transform .45s ease',
    }}>
      {activeTab === 'lessons'  && <LessonsView  courses={coursesData} />}
      {activeTab === 'glossary' && <GlossaryView glossary={glossaryData} />}
      {activeTab === 'quiz'     && <QuizView     quizData={quizDataSet} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VUE 1 — COURS
───────────────────────────────────────────── */
function LessonsView({ courses }) {
  const [open, setOpen] = useState(null);

  const icons = [Hourglass, Globe, Search, FileText, BookOpen];
  const tags  = ['Fondamentaux','Analyse','Portefeuille','Instruments','Avancé'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:T.border, border:`1px solid ${T.border}`, borderRadius:'8px', overflow:'hidden' }}>
      {courses.map((lesson, idx) => {
        const Icon    = icons[idx % icons.length];
        const isOpen  = open === lesson.id;
        const tagLabel = tags[idx] || `Module ${lesson.id}`;

        return (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            idx={idx}
            Icon={Icon}
            tagLabel={tagLabel}
            isOpen={isOpen}
            onToggle={() => setOpen(isOpen ? null : lesson.id)}
          />
        );
      })}
    </div>
  );
}

function LessonRow({ lesson, idx, Icon, tagLabel, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div style={{
      background: isOpen ? T.ink3 : T.ink2,
      transition:'background .3s',
      position:'relative',
    }}>
      {/* Row header — clickable */}
      <div
        onClick={onToggle}
        style={{
          display:'flex', alignItems:'center', gap:'1.5rem',
          padding:'1.6rem 2rem', cursor:'pointer',
          userSelect:'none',
        }}
      >
        {/* Number */}
        <div style={{
          fontFamily: style.fontDisplay,
          fontSize:'1.5rem', fontWeight:300,
          color: isOpen ? T.gold : T.muted,
          minWidth:'2rem', transition:'color .3s',
        }}>
          {String(idx + 1).padStart(2,'0')}
        </div>

        {/* Icon */}
        <div style={{
          width:'44px', height:'44px', borderRadius:'4px', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          background: isOpen ? `rgba(197,160,89,.12)` : 'rgba(245,239,224,.04)',
          border:`1px solid ${isOpen ? T.borderHover : 'rgba(245,239,224,.06)'}`,
          color: isOpen ? T.gold : T.dimText,
          transition:'all .3s',
        }}>
          <Icon size={18} />
        </div>

        {/* Text */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem', marginBottom:'.35rem', flexWrap:'wrap' }}>
            <span style={{
              fontSize:'.58rem', fontWeight:600, letterSpacing:'.16em', textTransform:'uppercase',
              color: T.goldDk,
              background:'rgba(197,160,89,.08)',
              border:`1px solid rgba(197,160,89,.14)`,
              padding:'.15rem .55rem', borderRadius:'2px',
            }}>{tagLabel}</span>
            <span style={{ fontSize:'.65rem', color:T.dimText, display:'flex', alignItems:'center', gap:'.25rem' }}>
              <Clock size={10} /> 5 min
            </span>
          </div>
          <h3 style={{
            fontFamily: style.fontDisplay,
            fontSize:'1.2rem', fontWeight: isOpen ? 500 : 400,
            color: isOpen ? T.cream : 'rgba(245,239,224,.75)',
            transition:'color .3s',
            marginBottom: isOpen ? 0 : '.2rem',
            lineHeight:1.2,
          }}>
            {lesson.title}
          </h3>
          {!isOpen && (
            <p style={{ fontSize:'.78rem', color:T.dimText, marginTop:'.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60ch' }}>
              {lesson.summary}
            </p>
          )}
        </div>

        {/* Chevron */}
        <div style={{
          color: isOpen ? T.gold : T.dimText,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition:'transform .35s ease, color .3s',
          flexShrink:0,
        }}>
          <ChevronDown size={20} />
        </div>
      </div>

      {/* Expandable content */}
      <div style={{ height:`${height}px`, overflow:'hidden', transition:'height .45s cubic-bezier(.4,0,.2,1)' }}>
        <div ref={bodyRef} onClick={e => e.stopPropagation()}>
          <div style={{
            borderTop:`1px solid ${T.border}`,
            margin:'0 2rem',
            padding:'2rem 0 2.5rem',
          }}>
            {/* Pull-quote */}
            <blockquote style={{
              fontFamily: style.fontDisplay,
              fontStyle:'italic', fontWeight:300,
              fontSize:'1.15rem',
              color: T.cream,
              borderLeft:`3px solid ${T.gold}`,
              paddingLeft:'1.2rem',
              marginBottom:'1.8rem',
              lineHeight:1.6,
            }}>
              "{lesson.summary}"
            </blockquote>

            {/* Body */}
            <div style={{
              fontFamily: style.fontBody,
              fontSize:'.9rem', fontWeight:300,
              color:'rgba(245,239,224,.7)',
              lineHeight:1.85,
            }}>
              {lesson.content}
            </div>

            {/* Close button */}
            <div style={{ marginTop:'2rem', display:'flex', justifyContent:'flex-end' }}>
              <button
                onClick={e => { e.stopPropagation(); onToggle(); }}
                style={{
                  background:'transparent',
                  border:`1px solid ${T.border}`,
                  color:T.dimText, borderRadius:'3px',
                  padding:'.45rem 1.1rem',
                  fontSize:'.7rem', fontWeight:500,
                  letterSpacing:'.1em', textTransform:'uppercase',
                  cursor:'pointer', fontFamily:style.fontBody,
                  transition:'border-color .2s, color .2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor=T.gold; e.target.style.color=T.gold; }}
                onMouseLeave={e => { e.target.style.borderColor=T.border; e.target.style.color=T.dimText; }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VUE 2 — GLOSSAIRE
───────────────────────────────────────────── */
function GlossaryView({ glossary }) {
  const [query, setQuery] = useState('');
  const filtered = glossary.filter(g =>
    g.term.toLowerCase().includes(query.toLowerCase()) ||
    g.def.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div style={{ position:'relative', maxWidth:'520px', margin:'0 auto 2.5rem' }}>
        <Search size={16} style={{ position:'absolute', left:'1.1rem', top:'50%', transform:'translateY(-50%)', color:T.dimText, pointerEvents:'none' }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un terme — Riba, Sukuk, Zakat…"
          style={{
            width:'100%', paddingLeft:'2.8rem', paddingRight:'1.2rem',
            paddingTop:'.9rem', paddingBottom:'.9rem',
            background: T.ink2,
            border:`1px solid ${query ? T.borderHover : T.border}`,
            borderRadius:'4px',
            color: T.cream,
            fontFamily:style.fontBody, fontSize:'.85rem', fontWeight:300,
            outline:'none', transition:'border-color .3s',
          }}
          onFocus={e => e.target.style.borderColor=T.gold}
          onBlur={e => e.target.style.borderColor=query ? T.borderHover : T.border}
        />
      </div>

      {/* Results count */}
      {query && (
        <p style={{ textAlign:'center', fontSize:'.72rem', color:T.dimText, letterSpacing:'.1em', marginBottom:'1.5rem' }}>
          {filtered.length} terme{filtered.length!==1?'s':''} trouvé{filtered.length!==1?'s':''}
        </p>
      )}

      {filtered.length > 0 ? (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
          gap:'1px',
          background: T.border,
          border:`1px solid ${T.border}`,
          borderRadius:'8px', overflow:'hidden',
        }}>
          {filtered.map((item, idx) => (
            <GlossaryCard key={idx} item={item} idx={idx} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'5rem 2rem', color:T.dimText }}>
          <BookOpen size={36} style={{ margin:'0 auto 1rem', opacity:.3, display:'block' }} />
          <p style={{ fontFamily:style.fontDisplay, fontStyle:'italic', fontSize:'1.1rem' }}>Aucun terme trouvé pour "{query}"</p>
        </div>
      )}
    </div>
  );
}

function GlossaryCard({ item, idx }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.ink3 : T.ink2,
        padding:'1.8rem 2rem',
        transition:'background .25s',
        position:'relative',
        cursor:'default',
      }}
    >
      {hovered && (
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:'2px',
          background:`linear-gradient(to right, transparent, ${T.gold}, transparent)`,
        }} />
      )}
      <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.8rem' }}>
        <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: hovered ? T.gold : T.goldDk, flexShrink:0, transition:'background .25s' }} />
        <h4 style={{
          fontFamily:style.fontDisplay,
          fontSize:'1.25rem', fontWeight: hovered ? 500 : 400,
          color: hovered ? T.gold : T.cream,
          transition:'color .25s',
        }}>
          {item.term}
        </h4>
      </div>
      <p style={{ fontSize:'.82rem', color:T.dimText, lineHeight:1.75, fontWeight:300 }}>
        {item.def}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VUE 3 — QUIZ
───────────────────────────────────────────── */
function QuizView({ quizData }) {
  const [current, setCurrent]   = useState(0);
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect]   = useState(null);
  const [answers, setAnswers]   = useState([]);

  const progress = (current / quizData.length) * 100;

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === quizData[current].correct;
    setCorrect(isCorrect);
    setAnswers(a => [...a, isCorrect]);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      const next = current + 1;
      if (next < quizData.length) { setCurrent(next); setSelected(null); setCorrect(null); }
      else setDone(true);
    }, 1400);
  };

  const reset = () => { setCurrent(0); setScore(0); setDone(false); setSelected(null); setCorrect(null); setAnswers([]); };

  const pct    = Math.round((score / quizData.length) * 100);
  const grade  = pct >= 80 ? { label:'Excellent', color:'#59c578', icon:'🏆' }
               : pct >= 60 ? { label:'Bien',       color:T.gold,    icon:'⭐' }
               :             { label:'À revoir',    color:'#e07070', icon:'📚' };

  if (done) return <QuizResult score={score} total={quizData.length} pct={pct} grade={grade} answers={answers} onReset={reset} />;

  const q = quizData[current];

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto' }}>
      {/* Progress bar */}
      <div style={{
        height:'2px', background:'rgba(197,160,89,.1)',
        borderRadius:'1px', marginBottom:'2rem', overflow:'hidden',
      }}>
        <div style={{
          height:'100%', width:`${progress}%`,
          background:`linear-gradient(to right, ${T.goldDk}, ${T.gold})`,
          borderRadius:'1px', transition:'width .5s ease',
        }} />
      </div>

      {/* Question header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <span style={{
          fontSize:'.65rem', fontWeight:600, letterSpacing:'.18em', textTransform:'uppercase',
          color:T.dimText, background:T.ink2, border:`1px solid ${T.border}`,
          padding:'.3rem .8rem', borderRadius:'3px',
        }}>
          {current + 1} / {quizData.length}
        </span>
        <div style={{ display:'flex', gap:'.25rem' }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              width:'8px', height:'8px', borderRadius:'50%',
              background: a ? '#59c578' : '#e07070',
            }} />
          ))}
          {Array.from({ length: quizData.length - answers.length }).map((_, i) => (
            <div key={i} style={{ width:'8px', height:'8px', borderRadius:'50%', background:'rgba(245,239,224,.1)' }} />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 style={{
        fontFamily:style.fontDisplay,
        fontSize:'clamp(1.4rem, 3vw, 2rem)',
        fontWeight:400, lineHeight:1.25,
        color:T.cream, marginBottom:'2.5rem',
      }}>
        {q.question}
      </h3>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
        {q.options.map((opt, idx) => {
          const isCorrectOpt  = idx === q.correct;
          const isSelectedOpt = idx === selected;
          let bg = T.ink2, border = T.border, color = 'rgba(245,239,224,.7)';
          let icon = null;

          if (selected !== null) {
            if (isCorrectOpt) { bg='rgba(89,197,120,.07)'; border='rgba(89,197,120,.5)'; color='#59c578'; icon=<CheckCircle size={18} style={{color:'#59c578'}} />; }
            else if (isSelectedOpt) { bg='rgba(224,112,112,.07)'; border='rgba(224,112,112,.5)'; color='#e07070'; icon=<XCircle size={18} style={{color:'#e07070'}} />; }
            else { bg=T.ink2; border='rgba(245,239,224,.05)'; color='rgba(245,239,224,.3)'; }
          }

          return (
            <QuizOption key={idx} opt={opt} onClick={() => handleAnswer(idx)}
              disabled={selected !== null} bg={bg} border={border} color={color} icon={icon} />
          );
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div style={{
          marginTop:'1.5rem', padding:'.9rem 1.2rem',
          background: correct ? 'rgba(89,197,120,.06)' : 'rgba(224,112,112,.06)',
          border:`1px solid ${correct ? 'rgba(89,197,120,.2)' : 'rgba(224,112,112,.2)'}`,
          borderRadius:'4px',
          fontSize:'.82rem',
          color: correct ? '#59c578' : '#e07070',
          display:'flex', alignItems:'center', gap:'.6rem',
          animation:'feedbackIn .3s ease',
        }}>
          {correct ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {correct ? 'Exact — Bonne réponse !' : `Incorrect — La bonne réponse était : ${q.options[q.correct]}`}
        </div>
      )}
    </div>
  );
}

function QuizOption({ opt, onClick, disabled, bg, border, color, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:'100%', textAlign:'left',
        padding:'1.1rem 1.4rem',
        background: hov && !disabled ? T.ink3 : bg,
        border:`1px solid ${hov && !disabled ? T.borderHover : border}`,
        borderRadius:'4px',
        color: color,
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.8rem',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily:style.fontBody, fontSize:'.88rem', fontWeight:300,
        transition:'all .2s',
        outline:'none',
      }}
    >
      <span>{opt}</span>
      {icon || (hov && !disabled && <ChevronRight size={16} style={{color:T.dimText}} />)}
    </button>
  );
}

function QuizResult({ score, total, pct, grade, answers, onReset }) {
  return (
    <div style={{ maxWidth:'600px', margin:'0 auto', textAlign:'center' }}>
      {/* Trophy */}
      <div style={{
        width:'88px', height:'88px', borderRadius:'50%',
        background:`rgba(197,160,89,.08)`,
        border:`1px solid ${T.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 2rem', fontSize:'2.2rem',
      }}>
        {grade.icon}
      </div>

      <div style={{ fontFamily:style.fontDisplay, fontSize:'clamp(3rem,8vw,5.5rem)', fontWeight:300, color:grade.color, lineHeight:1 }}>
        {pct}<span style={{ fontSize:'40%', color:T.dimText }}>%</span>
      </div>

      <div style={{ fontFamily:style.fontDisplay, fontStyle:'italic', fontSize:'1.4rem', color:T.cream, margin:'.6rem 0 .3rem' }}>
        {grade.label}
      </div>

      <p style={{ fontSize:'.82rem', color:T.dimText, marginBottom:'2.5rem' }}>
        {score} bonne{score!==1?'s':''} réponse{score!==1?'s':''} sur {total}
      </p>

      {/* Answer dots */}
      <div style={{ display:'flex', justifyContent:'center', gap:'.35rem', marginBottom:'3rem' }}>
        {answers.map((a, i) => (
          <div key={i} title={`Q${i+1}: ${a?'✓':'✗'}`} style={{
            width:'10px', height:'10px', borderRadius:'50%',
            background: a ? '#59c578' : '#e07070',
          }} />
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:'.8rem', justifyContent:'center', flexWrap:'wrap' }}>
        <button onClick={onReset} style={{
          display:'inline-flex', alignItems:'center', gap:'.5rem',
          background:T.gold, color:T.ink,
          padding:'.8rem 2rem',
          border:'none', borderRadius:'3px',
          fontFamily:style.fontBody, fontSize:'.75rem', fontWeight:600,
          letterSpacing:'.12em', textTransform:'uppercase',
          cursor:'pointer', transition:'background .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background=T.goldLt}
        onMouseLeave={e => e.currentTarget.style.background=T.gold}
        >
          <RotateCcw size={14} /> Rejouer
        </button>
      </div>
    </div>
  );
}

/* ─── keyframe injection ─── */
if (typeof document !== 'undefined' && !document.getElementById('athar-quiz-styles')) {
  const s = document.createElement('style');
  s.id = 'athar-quiz-styles';
  s.textContent = `
    @keyframes feedbackIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
    * { box-sizing: border-box; }
    input::placeholder { color: rgba(245,239,224,.3); }
  `;
  document.head.appendChild(s);
}
