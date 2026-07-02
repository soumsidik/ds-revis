import { useState } from 'react'
import { signInAdmin } from '../services/firebaseService'
import logoDs from '../assets/logods.png'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL ?? 'admin@dsrevis.com'
  const adminPassword = import.meta.env.VITE_FIREBASE_ADMIN_PASSWORD ?? 'admin123'

  const [email, setEmail] = useState(adminEmail)
  const [password, setPassword] = useState(adminPassword)
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setLoginError('')

    try {
      await signInAdmin(email.trim(), password)
      onLogin()
    } catch (error: unknown) {
      const firebaseError = error as { message?: string; code?: string }
      const message = firebaseError.message ?? 'Email ou mot de passe incorrect ou compte introuvable'
      setLoginError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-[0_25px_80px_-40px_rgba(15,23,42,0.7)]">
        <div className="relative hidden w-[45%] flex-col justify-between bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#06b6d4_100%)] p-10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_18%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.15),_transparent_20%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-2xl">DS REVIS Admin</div>
            <h1 className="mt-10 text-4xl font-semibold leading-tight text-white">Panneau d’administration</h1>
            <p className="mt-4 max-w-sm text-base text-sky-100/80">Gérez les comptes, les filières, les cours et les quiz de votre plateforme d’apprentissage.</p>
          </div>
          <div className="relative z-10 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">Aujourd’hui</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">En ligne</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 px-3 py-4"><div className="text-xl font-semibold text-white">128</div><div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Étudiants</div></div>
              <div className="rounded-2xl bg-white/10 px-3 py-4"><div className="text-xl font-semibold text-white">18</div><div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Cours</div></div>
              <div className="rounded-2xl bg-white/10 px-3 py-4"><div className="text-xl font-semibold text-white">42</div><div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Quiz</div></div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white p-8 lg:w-[55%]">
          <div className="w-full max-w-md">
            <div className="mb-8">
              {/* REMPLACÉ : Le SVG générique par votre logo */}
                <div className="mb-4 inline-flex rounded-2xl bg-slate-50 p-1.5 shadow-sm">
                <img src={logoDs} alt="Logo DS REVIS" className="h-14 w-14 object-contain rounded-xl" />
                </div>
                <h2 className="text-3xl font-semibold text-slate-900">Connexion</h2>
              <p className="mt-2 text-sm text-slate-500">Accédez à votre espace admin DS REVIS</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Adresse email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white" placeholder="admin@dsrevis.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white" placeholder="••••••••" />
              </div>
              {loginError && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{loginError}</div>}
              <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
