'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ReportForm } from '@/components/incidents/report-form'
import { IncidentsList } from '@/components/incidents/incidents-list'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { LogOut, Plus, CheckCircle2, Bell } from 'lucide-react'

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'reportar' | 'seguimiento'>('reportar')
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AlertaUTEC</h1>
              <p className="text-xs text-muted-foreground">Reporta incidentes de forma segura</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="gap-2 border-border text-foreground hover:bg-secondary"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {showNotifications && (
        <NotificationCenter />
      )}

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('reportar')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'reportar'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Reportar Incidente
          </button>

          <button
            onClick={() => setActiveTab('seguimiento')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'seguimiento'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-2" />
            Mis Reportes
          </button>
        </div>

        {activeTab === 'reportar' && <ReportForm />}
        {activeTab === 'seguimiento' && <IncidentsList />}
      </main>
    </div>
  )
}
