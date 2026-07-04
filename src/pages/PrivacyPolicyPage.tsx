import logoDs from '../assets/logods.png'

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-md">
            <img src={logoDs} alt="DS REVIS" className="h-full w-full object-contain rounded-lg" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">DS REVIS</span>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('/')} 
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Retour à l'accueil
        </button>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Confidentialité & Sécurité</span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-slate-400">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-8 md:p-10 space-y-8 leading-relaxed text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Introduction</h2>
            <p>
              La présente Politique de Confidentialité a pour but d'informer les utilisateurs de la plateforme **DS REVIS** (incluant l'application mobile Android et l'interface d'administration web) sur la manière dont leurs données personnelles sont collectées, stockées, protégées et traitées.
            </p>
            <p>
              Nous accordons une importance primordiale à la confidentialité de vos informations de révision et de votre parcours d'études en santé.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Collecte des Données</h2>
            <p>
              Dans le cadre de l'utilisation de l'application mobile et des services DS REVIS, nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-450">
              <li>**Informations de Profil :** Votre nom complet, votre adresse email.</li>
              <li>**Informations d'Orientation Académique :** Votre filière d'études (ex: IDE, SF, AS) et votre niveau ou année d'étude (ex: Licence 1, Licence 2).</li>
              <li>**Données de Progression :** Vos réponses aux quiz, vos scores de validation, et les fiches de cours lues ou téléchargées.</li>
              <li>**Données de Compte :** Votre statut d'abonnement (Premium ou Standard) et l'état d'activation de votre profil.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Utilisation des Données</h2>
            <p>
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-450">
              <li>Permettre l'authentification et sécuriser l'accès à votre espace de révision.</li>
              <li>Sauvegarder et synchroniser votre progression en temps réel pour que vous ne perdiez pas l'historique de vos révisions.</li>
              <li>Calculer vos statistiques individuelles d'apprentissage et vous afficher votre taux d'avancement.</li>
              <li>Gérer votre statut Premium et vous donner accès aux ressources réservées.</li>
              <li>Améliorer le contenu pédagogique global de l'application à l'aide de statistiques anonymisées.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Stockage et Sécurité des Données</h2>
            <p>
              Toutes les données de la plateforme DS REVIS sont stockées sur les serveurs sécurisés de **Firebase** (Google Cloud Platform) via Firestore et Firebase Authentication.
            </p>
            <p>
              Nous mettons en œuvre des règles de sécurité Firebase strictes empêchant tout accès non autorisé à vos données personnelles. Aucun mot de passe n'est stocké en clair ; ils sont chiffrés à l'aide des algorithmes de sécurité standards de Firebase Authentication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Partage des Données</h2>
            <p>
              Nous nous engageons à **ne jamais vendre, échanger, louer ou divulguer** vos données personnelles à des tiers à des fins publicitaires ou commerciales. Les données sont conservées strictement au sein de la structure technologique de DS REVIS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Vos Droits</h2>
            <p>
              Conformément à la réglementation sur la protection des données personnelles, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-450">
              <li>**Droit d'accès et de rectification :** Vous pouvez à tout moment modifier les informations de votre profil depuis l'application mobile.</li>
              <li>**Droit à l'effacement (droit à l'oubli) :** Vous pouvez demander la suppression définitive de votre compte et de toutes vos données de progression en envoyant un email de demande à notre support.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Mises à Jour de la Politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité pour nous adapter aux évolutions réglementaires ou fonctionnelles de DS REVIS. Les utilisateurs seront informés de toute modification majeure directement via l'application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Contact</h2>
            <p>
              Pour toute question relative à cette politique ou pour demander la suppression de vos données, veuillez nous contacter à l'adresse suivante :
            </p>
            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 inline-block font-semibold text-sky-400">
              contact@dsrevis.com
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-855 bg-slate-950 py-8 text-slate-400 text-sm text-center">
        <p>© {new Date().getFullYear()} DS REVIS. Tous droits réservés.</p>
      </footer>

    </div>
  )
}
