import { useEffect, useState } from 'react'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { initializeFirebaseDemoData } from './services/migrationService'
import { ensureFirebaseCollections } from './services/ensureFirebaseCollections'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    initializeFirebaseDemoData().catch(() => {
      // ignored: the app can still run with local mock data until Firebase is configured.
    })

    ensureFirebaseCollections().catch(() => {
      // Firebase collections are created on first write; this is a safe fallback.
    })
  }, [])

  return isLoggedIn ? <DashboardPage onLogout={() => setIsLoggedIn(false)} /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />
}

export default App
