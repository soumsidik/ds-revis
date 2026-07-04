import { useEffect, useState } from 'react'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { LandingPage } from './pages/LandingPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { initializeFirebaseDemoData } from './services/migrationService'
import { ensureFirebaseCollections } from './services/ensureFirebaseCollections'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Gérer le routage client réactif (popstate et clics sur liens locaux)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)

    // Intercepter les clics sur les liens locaux pour éviter les rechargements de page
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.href && anchor.host === window.location.host) {
        const url = new URL(anchor.href)
        if (url.pathname !== window.location.pathname) {
          e.preventDefault()
          window.history.pushState({}, '', url.pathname)
          setCurrentPath(url.pathname)
        }
      }
    }

    window.addEventListener('click', handleAnchorClick)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  useEffect(() => {
    initializeFirebaseDemoData().catch(() => {
      // Ignoré si Firebase non configuré localement
    })

    ensureFirebaseCollections().catch(() => {
      // Ignoré si Firebase non configuré localement
    })
  }, [])

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  // Logique de Routage
  if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard')) {
    if (isLoggedIn) {
      return (
        <DashboardPage 
          onLogout={() => {
            setIsLoggedIn(false)
            navigateTo('/')
          }} 
        />
      )
    } else {
      // Redirige vers /login si l'utilisateur tente d'accéder au dashboard sans être connecté
      setTimeout(() => navigateTo('/login'), 0)
      return null
    }
  }

  if (currentPath === '/login') {
    if (isLoggedIn) {
      setTimeout(() => navigateTo('/dashboard'), 0)
      return null
    }
    return (
      <LoginPage 
        onLogin={() => {
          setIsLoggedIn(true)
          navigateTo('/dashboard')
        }} 
      />
    )
  }

  if (currentPath === '/politique-confidentialite' || currentPath === '/privacy') {
    return <PrivacyPolicyPage onNavigate={navigateTo} />
  }

  // Par défaut, on affiche la Landing Page
  return <LandingPage onNavigate={navigateTo} />
}

export default App

