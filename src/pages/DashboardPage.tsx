import { useState, type ReactNode } from 'react'
import { OverviewPanel } from '../components/dashboard/OverviewPanel'
import { UsersPanel } from '../components/dashboard/UsersPanel'
import { ClassesPanel } from '../components/dashboard/ClassesPanel'
import { FilieresPanel } from '../components/dashboard/FilieresPanel'
import { CoursesPanel } from '../components/dashboard/CoursesPanel'
import { QuizPanel } from '../components/dashboard/QuizPanel'
import type { MenuKey } from '../types'
import logoDs from '../assets/logods.png'

const iconMap: Record<string, ReactNode> = {
  overview: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5.5v-5h-5v5H4a1 1 0 0 1-1-1z"/></svg>,
  users: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  classes: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18"/></svg>,
  filieres: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>,
  courses: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>,
  quiz: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6"/><path d="M9 16h6"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z"/><path d="M9 8h.01"/></svg>,
}

interface DashboardPageProps {
  onLogout: () => void
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('overview')

  const menuItems: { key: MenuKey; label: string }[] = [
    { key: 'overview', label: 'Aperçu' },
    { key: 'users', label: 'Utilisateurs' },
    { key: 'classes', label: 'Années' },
    { key: 'filieres', label: 'Filières' },
    { key: 'courses', label: 'Cours' },
    { key: 'quiz', label: 'Quiz' },
  ]

  const renderContent = () => {
    switch (activeMenu) {
      case 'users':
        return <UsersPanel />
      case 'classes':
        return <ClassesPanel />
      case 'filieres':
        return <FilieresPanel />
      case 'courses':
        return <CoursesPanel />
      case 'quiz':
        return <QuizPanel />
      default:
        return <OverviewPanel />
    }
  }

  return (
    // h-screen fige l'application sur la hauteur de la fenêtre disponible
    <div className="h-screen w-screen p-4 lg:p-6 overflow-hidden bg-slate-100/50">
      {/* max-h-... et h-full empêchent le conteneur principal de dépasser de l'écran global */}
      <div className="mx-auto flex h-full max-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_80px_-50px_rgba(15,23,42,0.6)]">
        
        {/* Barre latérale gauche fixe (n'obéit plus au scroll) */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 px-5 py-6 lg:flex lg:flex-col h-full overflow-hidden">
           <div className="flex items-center gap-3 px-3">
                {/* REMPLACÉ : Le rectangle dégradé et le SVG par votre logo propre */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-md">
                    <img src={logoDs} alt="DS REVIS" className="h-full w-full object-contain rounded-xl" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-white">DS REVIS</div>
                    <div className="text-xs text-slate-400">Admin Panel</div>
                </div>
           </div>

          <nav className="mt-8 space-y-2 overflow-y-auto pr-1">
            {menuItems.map((item) => {
              const active = activeMenu === item.key
              return (
                <button key={item.key} onClick={() => setActiveMenu(item.key)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition cursor-pointer ${active ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                  <span className={`h-5 w-5 ${active ? 'text-sky-600' : 'text-slate-400'}`}>{iconMap[item.key]}</span>
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">AD</div>
              <div>
                <div className="text-sm font-semibold text-white">Admin DS</div>
                <div className="text-xs text-slate-400">Super admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENEUR DE DROITE MODIFIÉ : Seul ce bloc défile verticalement via sa propre zone de scroll */}
        <main className="flex-1 flex flex-col h-full bg-slate-50/70 overflow-hidden">
          
          {/* En-tête fixe en haut à droite */}
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 lg:hidden">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                </button>
                <div>
                  <div className="text-sm text-slate-500">Bonjour</div>
                  <h2 className="text-xl font-semibold text-slate-900">Admin DS REVIS</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 6 3 7 3 7H3s3-1 3-7"/><path d="M10 21a2 2 0 0 0 4 0"/></svg></button>
                <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 cursor-pointer transition hover:bg-slate-50">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Zone interne de défilement dédiée aux composants (Overview, Users, Courses...) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  )
}