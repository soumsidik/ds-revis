import { useState, useEffect } from 'react'
import { 
  getUsersFromFirestore, 
  updateUser, 
  deleteUser,
  getYearsFromFirestore,
  getFilieresFromFirestore,
  type FirestoreAppUser,
  type AcademicYear,
  type FiliereItem
} from '../../services/firebaseService'

export function UsersPanel() {
  // Liste des états pour les données Firestore
  const [users, setUsers] = useState<FirestoreAppUser[]>([])
  const [classes, setClasses] = useState<AcademicYear[]>([])
  const [filieres, setFilieres] = useState<FiliereItem[]>([])
  
  // États de chargement et d'affichage
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [modalState, setModalState] = useState<{ type: 'edit' | 'delete'; item: FirestoreAppUser | null }>({ 
    type: 'edit', 
    item: null 
  })
  const [draft, setDraft] = useState<FirestoreAppUser | null>(null)

  // Notification flash automatique (3 secondes)
  const triggerFlash = (text: string, type: 'success' | 'error' = 'success') => {
    setFlashMessage({ text, type })
    setTimeout(() => setFlashMessage(null), 3000)
  }

  // Chargement global synchrone depuis Firebase
  const loadAllData = async () => {
    try {
      setLoading(true)
      const [fetchedUsers, fetchedClasses, fetchedFilieres] = await Promise.all([
        getUsersFromFirestore(),
        getYearsFromFirestore(),
        getFilieresFromFirestore()
      ])

      setUsers(fetchedUsers)
      setClasses(fetchedClasses)
      setFilieres(fetchedFilieres)
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error)
      triggerFlash("Erreur lors de la récupération des données utilisateurs.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const openEdit = (user: FirestoreAppUser) => {
    setDraft({ ...user })
    setModalState({ type: 'edit', item: user })
  }

  const openDelete = (user: FirestoreAppUser) => {
    setModalState({ type: 'delete', item: user })
  }

  const closeModal = () => {
    setModalState({ type: 'edit', item: null })
    setDraft(null)
  }

  // Enregistrer les modifications de la modal (Update)
  const saveUser = async () => {
    if (!draft || !modalState.item) return

    try {
      const updates = {
        name: draft.name.trim(),
        email: draft.email.trim(),
        level: draft.level,
        filiere: draft.filiere,
        isActive: draft.isActive,
        premium: draft.premium
      }

      await updateUser(modalState.item.id, updates)
      triggerFlash(`Le profil de "${updates.name}" a été mis à jour.`)
      closeModal()
      await loadAllData()
    } catch (error) {
      console.error("Erreur lors de la modification :", error)
      triggerFlash("Impossible de modifier le profil.", "error")
    }
  }

  // Supprimer un utilisateur de Firestore (Delete)
  const handleDeleteUser = async () => {
    if (!modalState.item) return
    const userName = modalState.item.name

    try {
      await deleteUser(modalState.item.id)
      triggerFlash(`L'utilisateur "${userName}" a été retiré de la base de données.`)
      closeModal()
      await loadAllData()
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
      triggerFlash("Erreur lors de la suppression de l'utilisateur.", "error")
    }
  }

  // Permuter rapidement le statut Actif/Suspendu en un clic sur le tableau
  const toggleUserStatus = async (user: FirestoreAppUser) => {
    try {
      const nextStatus = !user.isActive
      await updateUser(user.id, { isActive: nextStatus })
      triggerFlash(`Statut mis à jour : ${user.name} est maintenant ${nextStatus ? 'Actif' : 'Suspendu'}.`)
      await loadAllData()
    } catch (error) {
      console.error(error)
      triggerFlash("Erreur lors du changement de statut.", "error")
    }
  }

  // Permuter rapidement l'abonnement Premium/Standard en un clic sur le tableau
  const toggleUserPremium = async (user: FirestoreAppUser) => {
    try {
      const nextPremium = !user.premium
      await updateUser(user.id, { premium: nextPremium })
      triggerFlash(`Abonnement mis à jour : ${user.name} est désormas ${nextPremium ? 'Premium' : 'Standard'}.`)
      await loadAllData()
    } catch (error) {
      console.error(error)
      triggerFlash("Erreur lors de la mutation d'abonnement.", "error")
    }
  }

  // Filtrage par texte (Nom et adresse e-mail)
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
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

      {/* Barre d'action supérieure */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Gestion</p>
          <h2 className="text-2xl font-semibold text-slate-900">Utilisateurs</h2>
        </div>
        
        {/* Module de recherche */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      {loading ? (
        <div className="text-center py-10 text-slate-500 font-medium">Récupération des comptes étudiants...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-slate-500 font-medium">
          {searchTerm ? "Aucun utilisateur ne correspond à votre recherche." : "Aucun utilisateur trouvé."}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3">Filière</th>
                  <th className="px-4 py-3">Premium</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{user.level || 'Non spécifié'}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{user.filiere || 'Non spécifié'}</td>
                    
                    {/* Toggle Premium direct */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleUserPremium(user)}
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          user.premium ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {user.premium ? 'Premium' : 'Standard'}
                      </button>
                    </td>

                    {/* Toggle Statut direct */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          user.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        {user.isActive ? 'Actif' : 'Suspendu'}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(user)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition" aria-label="Modifier utilisateur">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"/></svg>
                        </button>
                        <button onClick={() => openDelete(user)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-rose-300 hover:text-rose-600 transition" aria-label="Supprimer utilisateur">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal d'édition / suppression de compte */}
      {modalState.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 overflow-y-auto" onClick={closeModal}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {modalState.type === 'delete' ? (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Supprimer l’utilisateur</h3>
                <p className="mt-3 text-sm text-slate-500">Voulez-vous vraiment éjecter définitivement <span className="font-semibold text-slate-800">{modalState.item.name}</span> ? Ses données de synchronisation cloud seront effacées.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
                  <button onClick={handleDeleteUser} className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white">Supprimer le compte</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Modifier l’utilisateur</h3>
                <div className="mt-4 grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nom complet</label>
                    <input value={draft?.name ?? ''} onChange={(e) => setDraft((prev) => prev ? { ...prev, name: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Adresse Email</label>
                    <input value={draft?.email ?? ''} onChange={(e) => setDraft((prev) => prev ? { ...prev, email: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
                  </div>
                  
                  {/* Liaison dynamique de la classe */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Classe (Niveau)</label>
                    <select value={draft?.level ?? ''} onChange={(e) => setDraft((prev) => prev ? { ...prev, level: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white">
                      <option value="">Sélectionner un niveau</option>
                      {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  
                  {/* Liaison dynamique de la filière */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Filière</label>
                    <select value={draft?.filiere ?? ''} onChange={(e) => setDraft((prev) => prev ? { ...prev, filiere: e.target.value } : prev)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white">
                      <option value="">Sélectionner une filière</option>
                      {filieres.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">Accès réseau (Statut)</span>
                    <button onClick={() => setDraft((prev) => prev ? { ...prev, isActive: !prev.isActive } : prev)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${draft?.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {draft?.isActive ? 'Compte Actif' : 'Compte Suspendu'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">Privilèges d'abonnement</span>
                    <button onClick={() => setDraft((prev) => prev ? { ...prev, premium: !prev.premium } : prev)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${draft?.premium ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      {draft?.premium ? 'Membre Premium' : 'Membre Standard'}
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600">Annuler</button>
                  <button onClick={saveUser} className="rounded-2xl bg-slate-900 px-5 py-2 font-semibold text-white">Enregistrer le profil</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}