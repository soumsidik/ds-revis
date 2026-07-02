import { useState, useEffect } from 'react'
import { 
  getYearsFromFirestore, 
  addYear, 
  updateYear, 
  deleteYear,
  type AcademicYear 
} from '../../services/firebaseService'

export function ClassesPanel() {
  const [classes, setClasses] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  // États ajoutés pour la recherche et les notifications flash
  const [searchTerm, setSearchTerm] = useState('')
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [modalState, setModalState] = useState<{ type: 'edit' | 'delete'; item: AcademicYear | null }>({ 
    type: 'edit', 
    item: null 
  })

  // Fonction utilitaire pour déclencher un flash message
  const triggerFlash = (text: string, type: 'success' | 'error' = 'success') => {
    setFlashMessage({ text, type })
    setTimeout(() => {
      setFlashMessage(null)
    }, 3000)
  }

  const loadClasses = async () => {
    try {
      setLoading(true)
      const data = await getYearsFromFirestore()
      setClasses(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des classes:", error)
      triggerFlash("Impossible de charger les classes.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  const openEdit = (item: AcademicYear) => {
    setDraft(item.name)
    setModalState({ type: 'edit', item })
  }

  const openDelete = (item: AcademicYear) => {
    setDraft(item.name)
    setModalState({ type: 'delete', item })
  }

  const closeModal = () => {
    setModalState({ type: 'edit', item: null })
    setDraft('')
  }

  // Modification
  const saveClass = async () => {
    if (!draft.trim() || !modalState.item) return

    try {
      await updateYear(modalState.item.id, draft.trim())
      await loadClasses()
      triggerFlash(`La classe "${draft.trim()}" a été modifiée avec succès.`)
      closeModal()
    } catch (error) {
      console.error("Erreur lors de la modification :", error)
      triggerFlash("Erreur lors de la modification de la classe.", "error")
    }
  }

  // Suppression
  const handleDelete = async () => {
    if (!modalState.item) return
    const deletedName = modalState.item.name
    try {
      await deleteYear(modalState.item.id)
      await loadClasses()
      triggerFlash(`La classe "${deletedName}" a été supprimée.`)
      closeModal()
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
      triggerFlash("Erreur lors de la suppression de la classe.", "error")
    }
  }

  // Création
  const handleCreateFormSubmit = async () => {
    if (!draft.trim()) return
    try {
      await addYear(draft.trim())
      const addedName = draft.trim()
      setDraft('')
      setShowForm(false)
      await loadClasses()
      triggerFlash(`La classe "${addedName}" a été ajoutée avec succès.`)
    } catch (error) {
      console.error("Erreur lors de la création :", error)
      triggerFlash("Erreur lors de la création de la classe.", "error")
    }
  }

  // Filtrage des classes en fonction de la saisie utilisateur
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Zone Flash Message / Notification de succès */}
      {flashMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-2xl transition-all duration-300 ${
          flashMessage.type === 'success' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'
        }`}>
          {flashMessage.type === 'success' ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
          )}
          {flashMessage.text}
        </div>
      )}

      {/* Barre d'actions supérieure */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Gestion</p>
          <h2 className="text-2xl font-semibold text-slate-900">Classes</h2>
        </div>
        
        {/* Conteneur Recherche + Bouton Ajouter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
          {/* Champ de recherche */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <button onClick={() => { setDraft(''); setModalState({ type: 'edit', item: null }); setShowForm((v) => !v) }} className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-500 whitespace-nowrap">
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Ajouter une classe
          </button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nom de la classe</label>
            <input 
              value={draft || ''} 
              onChange={(e) => setDraft(e.target.value)} 
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" 
              placeholder="Licence 2" 
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
            <button onClick={handleCreateFormSubmit} className="rounded-2xl bg-sky-600 px-4 py-2 font-semibold text-white">Enregistrer</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-500 font-medium">Chargement des classes depuis Firebase...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-10 text-slate-500 font-medium">
          {searchTerm ? "Aucun résultat ne correspond à votre recherche." : "Aucune classe trouvée."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filteredClasses.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Active</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">Période académique gérée depuis le tableau de bord.</p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => openEdit(item)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-sky-300 hover:text-sky-600" aria-label="Modifier la classe">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"/></svg>
                </button>
                <button onClick={() => openDelete(item)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-rose-300 hover:text-rose-600" aria-label="Supprimer la classe">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalState.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={closeModal}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {modalState.type === 'delete' ? (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Supprimer la classe</h3>
                <p className="mt-3 text-sm text-slate-500">Voulez-vous vraiment supprimer <span className="font-semibold text-slate-800">{modalState.item.name}</span> ?</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
                  <button onClick={handleDelete} className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white">Supprimer</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Modifier la classe</h3>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nom de la classe</label>
                  <input 
                    value={draft || ''} 
                    onChange={(e) => setDraft(e.target.value)} 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3" 
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
                  <button onClick={saveClass} className="rounded-2xl bg-sky-600 px-4 py-2 font-semibold text-white">Enregistrer</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}