'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { Dashboard } from '@/components/dashboard/dashboard'
import { UserRole } from '@/lib/types'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  const handleLogin = (role: UserRole) => {
    setUserRole(role)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <Dashboard role={userRole!} onLogout={handleLogout} />
}
