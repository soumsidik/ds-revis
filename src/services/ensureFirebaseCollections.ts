import { collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Prépare les collections Firebase pour le projet de manière saine.
 * Crée les structures si elles sont vides, crée le profil admin,
 * mais NE charge AUCUNE donnée mockée (cours, quiz, classes, filières restents vides).
 */
export async function ensureFirebaseCollections() {
  const requiredCollections = ['users', 'years', 'filieres', 'courses', 'quizQuestions']

  // Firestore crée les collections de manière paresseuse (lazy), 
  // faire un getDocs initial permet simplement de vérifier la connexion
  for (const name of requiredCollections) {
    try {
      await getDocs(collection(db, name))
    } catch {
      // Les collections seront créées automatiquement au premier ajout manuel
    }
  }

  const batch = writeBatch(db)
  const usersRef = collection(db, 'users')

  // On initialise UNIQUEMENT le profil de l'administrateur dans Firestore
  batch.set(doc(usersRef, 'admin-profile'), {
    name: 'Super Admin',
    email: import.meta.env.VITE_FIREBASE_ADMIN_EMAIL ?? 'admin@dsrevis.com',
    level: 'Admin',
    filiere: 'Admin',
    premium: true,
    isActive: true,
    role: 'admin',
  })

  // --- SUPPRESSION DES BOUCLES DE DONNÉES MOCKÉES ---
  // Toutes les boucles for (initialClasses, initialFilieres, globalCourses, globalQuizQuestions)
  // qui faisaient des "batch.set" ont été supprimées d'ici.

  await batch.commit()
  console.log("✔️ Structure Firestore prête et préservée vide.")
}