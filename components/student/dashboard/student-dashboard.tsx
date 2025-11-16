'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StudentReportForm } from '@/components/student/incidents/student-report-form'
import { StudentIncidentsList } from '@/components/student/incidents/student-incidents-list'
import { StudentNotifications } from '@/components/student/notifications/student-notifications'
import { LogOut, Plus, History, Bell, Settings } from 'lucide-react'

interface StudentDashboardProps {
  studentId: string
  studentName: string
  onLogout: () => void
}

export function StudentDashboard({ studentId, studentName, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'nuevo' | 'mis-reportes' | 'notificaciones'>('nuevo')
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AlertaUTEC</h1>
              <p className="text-xs text-muted-foreground">Estudiante</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">ID:</span>
              <span className="text-sm font-mono text-primary">{studentId}</span>
            </div>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            </button>

            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="gap-2 border-border text-foreground hover:bg-secondary hidden sm:flex"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>

            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="sm:hidden"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <StudentNotifications onClose={() => setShowNotifications(false)} />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab('nuevo')}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'nuevo'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Reportar Incidente
          </button>

          <button
            onClick={() => setActiveTab('mis-reportes')}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'mis-reportes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Mis Reportes
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'nuevo' && <StudentReportForm studentId={studentId} />}
          {activeTab === 'mis-reportes' && <StudentIncidentsList studentId={studentId} />}
        </div>
      </main>
    </div>
  )
}
