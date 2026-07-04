import { useState, useEffect, useRef } from 'react'
import logoDs from '../assets/logods.png'

interface LandingPageProps {
  onNavigate: (path: string) => void
}

// Composant utilitaire pour animer les éléments au défilement (Scroll Reveal)
function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const current = domRef.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-98'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz' | 'progress'>('courses')
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownloadApk = () => {
    setIsDownloading(true)
    setDownloadSuccess(false)
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadSuccess(true)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden relative">
      
      {/* Styles CSS injectés pour les animations complexes autonomes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes orbit-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.15); }
        }
        @keyframes orbit-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.08); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-orbit-1 {
          animation: orbit-1 20s ease-in-out infinite;
        }
        .animate-orbit-2 {
          animation: orbit-2 25s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 8s ease-in-out infinite;
        }
        .glow-card:hover {
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.15);
        }
      `}</style>

      {/* Bulles d'ambiance lumineuses animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-sky-500/10 blur-[120px] animate-orbit-1" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] animate-orbit-2" />
        <div className="absolute bottom-[10%] left-[5%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] animate-orbit-1" />
      </div>

      {/* Header / Navigation */}
      <header className="relative z-50 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 transition duration-300">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-lg shadow-sky-500/5 transform hover:scale-105 transition duration-300">
            <img src={logoDs} alt="DS REVIS" className="h-full w-full object-contain rounded-lg" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">DS REVIS</span>
            <span className="ml-2 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/20">Mobile</span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-slate-350 hover:text-white transition duration-300">Fonctionnalités</a>
          <a href="#filiere" className="text-sm font-medium text-slate-350 hover:text-white transition duration-300">Filières</a>
          <a href="#download" className="text-sm font-medium text-slate-350 hover:text-white transition duration-300">Télécharger</a>
          <button 
            onClick={() => onNavigate('/politique-confidentialite')} 
            className="text-sm font-medium text-slate-400 hover:text-white transition duration-300 cursor-pointer"
          >
            Confidentialité
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid gap-12 lg:grid-cols-12 items-center">
        
        {/* Texte du Hero */}
        <div className="space-y-8 lg:col-span-7 transform transition duration-500">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-semibold text-sky-400 border border-slate-700/50 backdrop-blur-sm shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Plateforme de Révision Académique en Santé
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6.5xl leading-tight">
            Maîtrisez vos examens de santé avec <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">DS REVIS</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            Une application mobile optimisée pour les étudiants de l'INFAS, facilitant l'accès aux fiches de cours, la validation par quiz corrigés (QCM & QCD) et l'analyse de progression. Révisez partout, même hors-ligne.
          </p>

          {/* Boutons d'Action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleDownloadApk}
              disabled={isDownloading}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/20 hover:shadow-sky-500/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Génération de l'APK...
                </>
              ) : downloadSuccess ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 text-white" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  Téléchargement Lancé !
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 transition-transform group-hover:translate-y-0.5 duration-300" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Télécharger l'APK Gratuitement
                </>
              )}
            </button>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/40 px-8 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800/70 hover:border-slate-650 transition-all duration-300"
            >
              En savoir plus
            </a>
          </div>

          {/* Label console d'administration */}
          <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M12 2v9M8 5l4-3 4 3" /></svg>
            Portail d'administration sécurisé configuré séparément.
          </div>
        </div>

        {/* Mockup de téléphone interactif */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          
          {/* Sélecteurs d'onglets */}
          <div className="mb-6 flex gap-1 rounded-2xl bg-slate-800/80 p-1 border border-slate-700/50 backdrop-blur-md shadow-lg">
            {[
              { key: 'courses', label: 'Cours' },
              { key: 'quiz', label: 'Quiz' },
              { key: 'progress', label: 'Progrès' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition duration-300 cursor-pointer ${
                  activeTab === tab.key 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Téléphone CSS interactif flottant */}
          <div className="animate-float relative w-[310px] h-[610px] rounded-[52px] border-[11px] border-slate-800 bg-slate-950 shadow-[0_35px_120px_-25px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10">
            {/* Encoche */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6.5 bg-slate-800 rounded-b-2xl z-40 flex items-center justify-center">
              <div className="w-12 h-1.5 bg-slate-900 rounded-full" />
            </div>

            {/* Barre de statut */}
            <div className="h-10 pt-4 px-6 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none z-30 shrink-0">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.17 19.58 10.53 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                <span className="w-4 h-2 bg-slate-400 rounded-sm inline-block" />
              </div>
            </div>

            {/* Contenu écran */}
            <div className="flex-1 overflow-hidden p-4 flex flex-col bg-slate-900 text-slate-100">
              {activeTab === 'courses' && (
                <div className="space-y-4 flex flex-col h-full animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Cours Récents</h4>
                      <p className="text-[9px] text-slate-400">Section Infirmier (IDE)</p>
                    </div>
                    <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[8px] font-bold text-sky-400 border border-sky-500/20">L1</span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[420px] pr-1">
                    {[
                      { title: 'Anatomie - Physiologie', desc: 'Introduction générale au corps humain et systèmes.', label: 'Gratuit' },
                      { title: 'Pharmacologie Clinique', desc: 'Calcul de doses, surveillance et effets.', label: 'Premium' },
                      { title: 'Pathologies Médicales', desc: 'Prise en charge infirmière et urgences.', label: 'Premium' },
                      { title: 'Déontologie Infirmière', desc: 'Règles éthiques et responsabilité.', label: 'Gratuit' },
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 flex items-start gap-2.5 hover:border-slate-600 transition duration-300">
                        <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20">
                          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${item.label === 'Premium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-750 text-slate-350'}`}>{item.label}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4 flex flex-col h-full animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Quiz Interactif</h4>
                      <p className="text-[9px] text-slate-400">Pharmacologie L2</p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-400">QCM</span>
                  </div>

                  <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-700/30 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Question 2 / 10</div>
                      <p className="text-xs font-semibold text-white leading-relaxed">
                        Quel muscle est le site privilégié pour une injection intramusculaire chez le nourrisson de moins de 1 an ?
                      </p>
                    </div>

                    <div className="space-y-2 my-4">
                      {[
                        { key: 'A', text: 'Grand fessier', state: 'normal' },
                        { key: 'B', text: 'Deltoïde', state: 'normal' },
                        { key: 'C', text: 'Vaste externe (Cuisse)', state: 'correct' },
                        { key: 'D', text: 'Biceps brachial', state: 'normal' },
                      ].map((opt) => (
                        <div 
                          key={opt.key} 
                          className={`rounded-xl p-2.5 text-[10px] font-medium border flex items-center justify-between cursor-pointer transition duration-300 ${
                            opt.state === 'correct' 
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-350 hover:border-slate-600'
                          }`}
                        >
                          <span>{opt.key}. {opt.text}</span>
                          {opt.state === 'correct' && (
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-400 animate-scaleIn" fill="none" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800/50 text-[9px] text-slate-400 leading-normal">
                      💡 <span className="font-semibold text-slate-350">Explication :</span> Le vaste externe est plus développé et sécurisé à cet âge.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="space-y-4 flex flex-col h-full animate-fadeIn">
                  <div>
                    <h4 className="text-sm font-bold text-white">Votre Progression</h4>
                    <p className="text-[9px] text-slate-400">Tableau de bord étudiant</p>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {/* Carte Progression */}
                    <div className="rounded-2xl bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 p-4 border border-sky-500/20 text-center space-y-2 relative overflow-hidden">
                      <div className="text-2xl font-black text-white">76%</div>
                      <div className="text-[9px] uppercase font-bold text-sky-400 tracking-wider">Objectif Hebdomadaire</div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '76%' }} />
                      </div>
                    </div>

                    {/* Stats */}
                    {[
                      { label: 'Quiz validés', val: '80%', color: 'border-emerald-500/35 bg-emerald-500/5 text-emerald-400' },
                      { label: 'Fiches lues', val: '62%', color: 'border-sky-500/35 bg-sky-500/5 text-sky-400' },
                      { label: 'Jours actifs', val: '5 / 7', color: 'border-indigo-500/35 bg-indigo-500/5 text-indigo-400' },
                    ].map((stat, idx) => (
                      <div key={idx} className={`rounded-xl border p-3 flex justify-between items-center transition hover:scale-101 duration-300 ${stat.color}`}>
                        <span className="text-[10px] font-semibold">{stat.label}</span>
                        <span className="text-xs font-black">{stat.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation téléphone */}
            <div className="h-14 border-t border-slate-850 bg-slate-950 flex items-center justify-around text-slate-500 select-none shrink-0 z-30">
              <span className={`flex flex-col items-center gap-1 cursor-pointer transition ${activeTab === 'courses' ? 'text-sky-500' : 'hover:text-slate-300'}`} onClick={() => setActiveTab('courses')}>
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
                <span className="text-[7px] font-bold">Cours</span>
              </span>
              <span className={`flex flex-col items-center gap-1 cursor-pointer transition ${activeTab === 'quiz' ? 'text-sky-500' : 'hover:text-slate-300'}`} onClick={() => setActiveTab('quiz')}>
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6"/><path d="M9 16h6"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z"/></svg>
                <span className="text-[7px] font-bold">Quiz</span>
              </span>
              <span className={`flex flex-col items-center gap-1 cursor-pointer transition ${activeTab === 'progress' ? 'text-sky-500' : 'hover:text-slate-300'}`} onClick={() => setActiveTab('progress')}>
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span className="text-[7px] font-bold">Progrès</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Description & Fonctionnalités Clés */}
      <section id="features" className="relative z-10 bg-slate-950 py-24 border-y border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6">
          
          <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Une expérience de révision moderne et autonome
            </h2>
            <p className="text-base text-slate-450">
              Chaque fonctionnalité est pensée pour répondre aux besoins réels de formation pratique et théorique des futurs agents de santé.
            </p>
          </ScrollReveal>

          <div className="mt-18 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Catalogue de Cours Structuré",
                desc: "Accédez à des fiches de cours claires et structurées, validées scientifiquement et rattachées directement à vos spécialités et classes.",
                color: "from-sky-500 to-cyan-500",
                icon: (
                  <svg className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                )
              },
              {
                title: "Quiz Corrigés Détaillés",
                desc: "Testez-vous avec des QCM (Choix Multiples) ou QCD (Vrai/Faux) et lisez les explications détaillées rédigées par des enseignants qualifiés.",
                color: "from-indigo-500 to-violet-500",
                icon: (
                  <svg className="h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                )
              },
              {
                title: "Statistiques & Suivi",
                desc: "Mesurez vos efforts en temps réel. Suivez votre taux de réussite par matière et identifiez directement les notions à consolider.",
                color: "from-emerald-500 to-teal-500",
                icon: (
                  <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                )
              },
              {
                title: "Mode Hors-ligne Actif",
                desc: "Pas de réseau ? Aucun problème. Les cours et les quiz chargés se stockent localement pour que vous puissiez réviser partout.",
                color: "from-amber-500 to-orange-500",
                icon: (
                  <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.5" />
                    <path d="M5 12.5a10.94 10.94 0 0 1 5.17-2.39" />
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                )
              },
              {
                title: "Formats QCM & Vrai/Faux",
                desc: "Préparez-vous à tous les types d'épreuves académiques grâce à nos formats de validation conformes aux épreuves de l'INFAS.",
                color: "from-rose-500 to-pink-500",
                icon: (
                  <svg className="h-6 w-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <line x1="9" y1="9" x2="15" y2="9" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="13" y2="17" />
                  </svg>
                )
              },
              {
                title: "Protection des Données",
                desc: "Vos données de progression et vos profils d'accès sont cryptés et synchronisés en toute sécurité via le Cloud Firebase.",
                color: "from-purple-500 to-indigo-500",
                icon: (
                  <svg className="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                )
              }
            ].map((feat, idx) => (
              <ScrollReveal 
                key={idx} 
                delay={idx * 100}
                className="glow-card group rounded-3xl border border-slate-800 bg-slate-900/40 p-8 hover:border-slate-700/80 transition-all duration-300 space-y-5 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-750 group-hover:bg-slate-750 group-hover:scale-105 transition-all duration-300">
                  {feat.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition duration-300">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-350 transition duration-300">{feat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section Filières et Niveaux */}
      <section id="filiere" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            <ScrollReveal className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Adapté aux principales filières de formation médicale et infirmière
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Que vous soyez en formation d'Infirmier d'État, de Sage-Femme, ou d'Auxiliaire de Santé, DS REVIS propose un contenu sur-mesure répondant scrupuleusement aux programmes officiels.
              </p>

              <div className="space-y-5 pt-2">
                {[
                  { label: "IDE (Infirmier Diplômé d'État)", desc: "De la pharmacologie aux soins de base, déontologie et pathologies cliniques.", color: "border-sky-500/20 text-sky-400 bg-sky-500/10" },
                  { label: "SF (Sage-Femme)", desc: "Suivi de grossesse, consultations prénatales, obstétrique et PMI.", color: "border-indigo-500/20 text-indigo-400 bg-indigo-500/10" },
                  { label: "AS (Auxiliaire de Santé)", desc: "Prise en charge de base des patients et hygiène en milieu hospitalier.", color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" }
                ].map((fil, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <span className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-xs font-black border transition-all duration-300 group-hover:scale-105 ${fil.color}`}>{idx+1}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition duration-300">{fil.label}</h4>
                      <p className="text-xs text-slate-400 mt-1">{fil.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Bloc visuel des statistiques */}
            <ScrollReveal delay={200} className="glow-card rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-6 relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Couverture des Programmes</span>
                <h3 className="text-xl font-bold text-white">Niveaux académiques pris en charge</h3>
              </div>

              <div className="space-y-5">
                {[
                  { name: "Licence 1 & AS L1", percent: 100 },
                  { name: "Licence 2 & AS L2", percent: 100 },
                  { name: "Licence 3", percent: 85 },
                ].map((level, idx) => (
                  <div key={idx} className="space-y-2 group">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{level.name}</span>
                      <span className="text-sky-400 group-hover:scale-105 transition duration-300">{level.percent}% du programme</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${level.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call to Action APK */}
      <section id="download" className="relative z-10 bg-gradient-to-tr from-slate-950 to-indigo-950/75 py-24 border-t border-slate-800/80">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <ScrollReveal className="space-y-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1.5 shadow-2xl transform hover:rotate-3 transition duration-300">
              <img src={logoDs} alt="Logo" className="h-full w-full object-contain rounded-xl" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              Prêt à booster vos révisions ?
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              Téléchargez l'application Android directement au format APK et accédez instantanément à toute la banque de cours et de quiz de la plateforme.
            </p>

            <div className="flex flex-col items-center gap-4 pt-4">
              <button 
                onClick={handleDownloadApk}
                disabled={isDownloading}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-sky-500 hover:bg-sky-400 px-10 py-5 text-base font-bold text-white shadow-2xl shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Génération du package APK...
                  </>
                ) : downloadSuccess ? (
                  <>
                    <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 text-white animate-scaleIn" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    Fichier APK Prêt !
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 transition-transform group-hover:translate-y-0.5 duration-300" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    Installer la version stable (v0.1.0)
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500">Sécurisé & certifié sans malware par Play Protect</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-sm">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-0.5">
              <img src={logoDs} alt="DS REVIS Logo" className="h-full w-full object-contain rounded-md" />
            </div>
            <span className="font-bold text-white">DS REVIS</span>
          </div>

          <div className="flex gap-6">
            <button 
              onClick={() => onNavigate('/politique-confidentialite')} 
              className="hover:text-white transition duration-300 cursor-pointer bg-transparent border-none p-0"
            >
              Politique de Confidentialité
            </button>
            <span className="text-slate-700">|</span>
            <span>Support: contact@dsrevis.com</span>
          </div>

          <p>© {new Date().getFullYear()} DS REVIS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
