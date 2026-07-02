import { useState, useEffect } from 'react'
import { 
  clearPedeagoficalDataOnly, 
  getDashboardStatistics, 
  type DashboardStats 
} from '../../services/firebaseService'

export function OverviewPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)

  // Fonction centrale pour charger les statistiques
  async function loadStats() {
    try {
      setLoading(true)
      const data = await getDashboardStatistics()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  // Action de purge déclenchée par le bouton 
  const handleResetPedagogicalData = async () => {
    const confirmation = window.confirm(
      "🚨 ATTENTION : Voulez-vous vraiment supprimer TOUS les cours, quiz, classes et filières ?\n\nCette action est irréversible. Les utilisateurs ne seront pas supprimés."
    )
    
    if (!confirmation) return

    try {
      setIsResetting(true)
      await clearPedeagoficalDataOnly()
      alert("Données pédagogiques réinitialisées avec succès !")
      await loadStats() // Rechargement instantané des compteurs à zéro
    } catch (error) {
      console.error("Erreur lors de la purge :", error)
      alert("Une erreur est survenue lors de la suppression.")
    } finally {
      setIsResetting(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-500 font-medium">
        Calcul et consolidation des statistiques en cours...
      </div>
    )
  }

  // Fonction utilitaire pour générer un graphique à barres verticales autonome
  const renderVerticalChart = (
    title: string, 
    subtitle: string, 
    dataset: { [key: string]: number }, 
    unitLabel: string, 
    gradientTone: string
  ) => {
    const entries = Object.entries(dataset)
    const maxValue = Math.max(...entries.map(([_, val]) => val), 1)

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 w-full">
        <div>
          <p className="text-sm text-slate-500">{subtitle}</p>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400 italic">Aucune donnée disponible.</div>
        ) : (
          /* Conteneur adaptatif du graphique vertical */
          <div className="flex items-end justify-between gap-4 h-64 pt-6 px-4 border-b border-slate-200 w-full overflow-x-auto">
            {entries.map(([key, val]) => {
              const heightPercentage = Math.max((val / maxValue) * 100, 8)
              
              return (
                <div key={key} className="flex flex-col items-center flex-1 min-w-[60px] h-full justify-end group space-y-2">
                  {/* Tooltip / Info-bulle de valeur */}
                  <div className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md mb-1 transition-opacity duration-200 shadow-md">
                    {val}
                  </div>

                  {/* Barre verticale animée */}
                  <div 
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-1000 bg-gradient-to-t ${gradientTone}`}
                    style={{ height: `${heightPercentage}%` }}
                  />

                  {/* Libellé de l'axe X */}
                  <div className="text-xs font-semibold text-slate-600 truncate max-w-full text-center pt-2">
                    {key}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="text-[11px] text-slate-400 font-medium tracking-wide">
          Unité : Nombre total de {unitLabel}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de réinitialisation à droite */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Tableau de bord</p>
          <h2 className="text-2xl font-semibold text-slate-900">Aperçu général</h2>
        </div>
        
        {/* Bouton de purge des données pédagogiques */}
        <button
          onClick={handleResetPedagogicalData}
          disabled={isResetting}
          className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077H4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          {isResetting ? "Réinitialisation..." : "Réinitialiser les données"}
        </button>
      </div>

      {/* Cartes de Score KPI globales */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Utilisateurs globaux', value: stats.totalUsers, subtitle: `${stats.premiumUsers} comptes Premium`, tone: 'from-sky-500 to-cyan-400' },
          { label: 'Classes (Années)', value: stats.totalYears, subtitle: 'Niveaux académiques', tone: 'from-indigo-500 to-violet-400' },
          { label: 'Cours en ligne', value: stats.totalCourses, subtitle: 'Supports de cours réels', tone: 'from-emerald-500 to-teal-400' },
          { label: 'Questions de Quiz', value: stats.totalQuizzes, subtitle: 'Validations actives', tone: 'from-amber-500 to-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${stat.tone}`} />
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Blocs de diagrammes verticaux autonomes */}
      <div className="space-y-6 w-full">
        {renderVerticalChart(
          "Utilisateurs inscrits par Année Académique",
          "Démographie étudiante",
          stats.usersByYear,
          "étudiants",
          "from-sky-500 to-cyan-400"
        )}

        {renderVerticalChart(
          "Utilisateurs inscrits par Filière d'étude",
          "Répartition par spécialité",
          stats.usersByFiliere,
          "étudiants",
          "from-indigo-500 to-violet-400"
        )}

        {renderVerticalChart(
          "Volume de cours par Année Académique",
          "Ressources pédagogiques",
          stats.coursesByYear,
          "supports de cours",
          "from-emerald-500 to-teal-400"
        )}

        {renderVerticalChart(
          "Volume de cours par Filière d'étude",
          "Ressources par spécialité",
          stats.coursesByFiliere,
          "supports de cours",
          "from-amber-500 to-orange-400"
        )}
      </div>
    </div>
  )
}