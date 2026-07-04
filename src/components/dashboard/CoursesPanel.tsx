import { useState, useEffect } from 'react'
import { 
  getCoursesFromFirestore, 
  addCourse, 
  updateCourse, 
  deleteCourse,
  getYearsFromFirestore,
  getFilieresFromFirestore,
  type FirestoreCourseItem,
  type AcademicYear,
  type FiliereItem
} from '../../services/firebaseService'

export function CoursesPanel() {
  // Liste des états pour les données Firestore
  const [courses, setCourses] = useState<FirestoreCourseItem[]>([])
  const [classes, setClasses] = useState<AcademicYear[]>([])
  const [filieres, setFilieres] = useState<FiliereItem[]>([])
  
  // États de chargement et d'affichage
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modèles d'initialisation pour les drafts (brouillons)
  const initialDraftState = { 
    title: '', 
    category: '', // Représente la Classe/Année académique
    filiere: '', 
    summary: '', 
    driveLink: '', 
    premiumOnly: false 
  }
  const [draft, setDraft] = useState(initialDraftState)
  
  const [modalState, setModalState] = useState<{ type: 'edit' | 'delete'; item: FirestoreCourseItem | null }>({ 
    type: 'edit', 
    item: null 
  })
  const [editDraft, setEditDraft] = useState<FirestoreCourseItem | null>(null)

  // Gestion des notifications de succès/erreur
  const triggerFlash = (text: string, type: 'success' | 'error' = 'success') => {
    setFlashMessage({ text, type })
    setTimeout(() => setFlashMessage(null), 3000)
  }

  // Chargement centralisé de toutes les données requises depuis Firebase
  const loadAllData = async () => {
    try {
      setLoading(true)
      const [fetchedCourses, fetchedClasses, fetchedFilieres] = await Promise.all([
        getCoursesFromFirestore(),
        getYearsFromFirestore(),
        getFilieresFromFirestore()
      ])

      setCourses(fetchedCourses)
      setClasses(fetchedClasses)
      setFilieres(fetchedFilieres)

      // Initialiser par défaut le formulaire d'ajout avec les premières valeurs dynamiques trouvées
      setDraft({
        title: '',
        category: fetchedClasses[0]?.name || '',
        filiere: fetchedFilieres[0]?.name || '',
        summary: '',
        driveLink: '',
        premiumOnly: false
      })
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données :", error)
      triggerFlash("Erreur lors de la récupération des données Firebase.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const openEdit = (course: FirestoreCourseItem) => {
    setEditDraft({ ...course })
    setModalState({ type: 'edit', item: course })
  }

  const openDelete = (course: FirestoreCourseItem) => {
    setModalState({ type: 'delete', item: course })
  }

  const closeModal = () => {
    setModalState({ type: 'edit', item: null })
    setEditDraft(null)
  }

  // Ajouter un nouveau cours (Create)
  const handleCreateCourse = async () => {
    if (!draft.title.trim() || !draft.summary.trim()) {
      triggerFlash("Veuillez remplir au moins le titre et le résumé.", "error")
      return
    }

    try {
      const newCourse = {
        title: draft.title.trim(),
        category: draft.category,
        filiere: draft.filiere,
        summary: draft.summary.trim(),
        driveLink: draft.driveLink.trim(),
        premiumOnly: draft.premiumOnly
      }

      await addCourse(newCourse)
      triggerFlash(`Le cours "${newCourse.title}" a été ajouté !`)
      setShowForm(false)
      // Réinitialiser le formulaire en préservant les sélecteurs par défaut
      setDraft({
        ...initialDraftState,
        category: classes[0]?.name || '',
        filiere: filieres[0]?.name || ''
      })
      await loadAllData()
    } catch (error) {
      console.error("Erreur lors de l'ajout du cours :", error)
      triggerFlash("Impossible d'ajouter le cours.", "error")
    }
  }

  // Modifier un cours existant (Update)
  const handleSaveEdit = async () => {
    if (!editDraft || !modalState.item) return

    try {
      const updates = {
        title: editDraft.title.trim(),
        category: editDraft.category,
        filiere: editDraft.filiere,
        summary: editDraft.summary.trim(),
        driveLink: editDraft.driveLink.trim(),
        premiumOnly: editDraft.premiumOnly
      }

      await updateCourse(modalState.item.id, updates)
      triggerFlash(`Le cours "${updates.title}" a été mis à jour avec succès.`)
      closeModal()
      await loadAllData()
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error)
      triggerFlash("Erreur lors de la modification du cours.", "error")
    }
  }

  // Supprimer un cours (Delete)
  const handleDeleteCourse = async () => {
    if (!modalState.item) return
    const courseTitle = modalState.item.title

    try {
      await deleteCourse(modalState.item.id)
      triggerFlash(`Le cours "${courseTitle}" a été supprimé.`)
      closeModal()
      await loadAllData()
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
      triggerFlash("Erreur lors de la suppression du cours.", "error")
    }
  }

  // Filtrage intelligent multi-critères
  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase()
    return (
      course.title.toLowerCase().includes(search) ||
      course.category.toLowerCase().includes(search) ||
      course.filiere.toLowerCase().includes(search)
    )
  })

  return (
    <div className="space-y-6">
      {/* Notifications Flash */}
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

      {/* Barre supérieure d'actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Gestion</p>
          <h2 className="text-2xl font-semibold text-slate-900">Cours</h2>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
          {/* Barre de recherche */}
          <div className="relative flex-1 sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher par titre, classe, filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <button onClick={() => setShowForm((v) => !v)} className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 whitespace-nowrap">
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Ajouter un cours
          </button>
        </div>
      </div>

      {/* Formulaire d'Ajout */}
      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Titre du cours</label>
              <input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" placeholder="Ex: Santé de la Reproduction & PMI" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Classe (Année académique)</label>
              <select value={draft.category} onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400">
                {classes.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Filière</label>
              <select value={draft.filiere} onChange={(e) => setDraft((prev) => ({ ...prev, filiere: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400">
                {filieres.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Lien Drive (Support PDF)</label>
              <input value={draft.driveLink} onChange={(e) => setDraft((prev) => ({ ...prev, driveLink: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" placeholder="https://drive.google.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Résumé</label>
              <textarea value={draft.summary} onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" rows={3} placeholder="Description complète du rôle ou des notions abordées..." />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input id="premiumOnly" type="checkbox" checked={draft.premiumOnly} onChange={(e) => setDraft((prev) => ({ ...prev, premiumOnly: e.target.checked }))} className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="premiumOnly" className="text-sm font-medium text-slate-700">Restreindre aux utilisateurs Premium</label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
            <button onClick={handleCreateCourse} className="rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white">Enregistrer</button>
          </div>
        </div>
      )}

      {/* Liste des cours ou loader */}
      {loading ? (
        <div className="text-center py-10 text-slate-500 font-medium">Synchronisation avec Firestore...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-10 text-slate-500 font-medium">
          {searchTerm ? "Aucun cours ne correspond à ce filtre." : "Aucun cours disponible."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCourses.map((course) => (
            <div key={course.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{course.category}</span>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{course.title}</h3>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.premiumOnly ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{course.premiumOnly ? 'Premium' : 'Public'}</span>
                </div>
                <p className="mt-3 text-sm text-slate-500 line-clamp-4">{course.summary}</p>
              </div>
              
              <div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span className="font-medium inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-700/10">{course.filiere}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(course)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-emerald-300 hover:text-emerald-600" aria-label="Modifier le cours">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"/></svg>
                    </button>
                    <button onClick={() => openDelete(course)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-rose-300 hover:text-rose-600" aria-label="Supprimer le cours">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                    </button>
                  </div>
                </div>
                {course.driveLink && (
                  <div className="mt-3 text-right">
                    <a href={course.driveLink} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-600 hover:underline">Voir le support de cours →</a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal unique (Edit / Delete) */}
      {modalState.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 overflow-y-auto" onClick={closeModal}>
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {modalState.type === 'delete' ? (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Supprimer le cours</h3>
                <p className="mt-3 text-sm text-slate-500">Voulez-vous vraiment supprimer le cours <span className="font-semibold text-slate-800">{modalState.item.title}</span> ? Cette action est irréversible.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
                  <button onClick={handleDeleteCourse} className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white">Supprimer définitivement</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Modifier le cours</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Titre du cours</label>
                    <input value={editDraft?.title ?? ''} onChange={(e) => setEditDraft((prev) => prev ? { ...prev, title: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Classe</label>
                    <select value={editDraft?.category ?? ''} onChange={(e) => setEditDraft((prev) => prev ? { ...prev, category: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                      {classes.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Filière</label>
                    <select value={editDraft?.filiere ?? ''} onChange={(e) => setEditDraft((prev) => prev ? { ...prev, filiere: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                      {filieres.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Lien Drive</label>
                    <input value={editDraft?.driveLink ?? ''} onChange={(e) => setEditDraft((prev) => prev ? { ...prev, driveLink: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Résumé</label>
                    <textarea value={editDraft?.summary ?? ''} onChange={(e) => setEditDraft((prev) => prev ? { ...prev, summary: e.target.value } : prev)} rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">Accès restreint aux abonnés Premium</span>
                    <button onClick={() => setEditDraft((prev) => prev ? { ...prev, premiumOnly: !prev.premiumOnly } : prev)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${editDraft?.premiumOnly ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      {editDraft?.premiumOnly ? 'Actif (Premium)' : 'Inactif (Public)'}
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
                  <button onClick={handleSaveEdit} className="rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white">Enregistrer les modifications</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}