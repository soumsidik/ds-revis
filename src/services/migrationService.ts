import { seedDefaultAdmin } from './firebaseService'

/**
 * Initialise l'application DS REVIS de manière saine.
 * Ce script s'assure exclusivement de l'existence du compte Admin.
 * Toutes les liaisons et importations automatiques de mockData ont été supprimées
 * pour empêcher définitivement les migrations parasites au rechargement.
 */
export async function initializeFirebaseDemoData() {
  const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL ?? 'admin@dsrevis.com'
  const adminPassword = import.meta.env.VITE_FIREBASE_ADMIN_PASSWORD ?? 'admin123'

  try {
    // Crée l'admin s'il n'existe pas, ou fusionne ses données s'il existe déjà
    await seedDefaultAdmin(adminEmail, adminPassword)
    console.log("✔️ [Firebase Initialization] Compte administrateur vérifié et sécurisé.")
  } catch (error) {
    console.error("❌ [Firebase Initialization] Échec de la vérification de l'administrateur :", error)
  }
}