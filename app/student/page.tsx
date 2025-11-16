'use client'

import { useState } from 'react'
import { StudentLoginForm } from '@/components/student/auth/student-login-form'
import { StudentDashboard } from '@/components/student/dashboard/student-dashboard'

export default function StudentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [studentId, setStudentId] = useState<string>('')
  const [studentName, setStudentName] = useState<string>('')

  const handleLogin = (id: string, name: string) => {
    setStudentId(id)
    setStudentName(name)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setStudentId('')
    setStudentName('')
  }

  if (!isAuthenticated) {
    return <StudentLoginForm onLogin={handleLogin} />
  }

  return (
    <StudentDashboard 
      studentId={studentId} 
      studentName={studentName}
      onLogout={handleLogout} 
    />
  )
}
