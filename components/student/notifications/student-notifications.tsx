'use client'

import { Bell, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StudentNotificationsProps {
  onClose: () => void
}

export function StudentNotifications({ onClose }: StudentNotificationsProps) {
  const notifications = [
    {
      id: 1,
      type: 'actualización',
      title: 'Tu reporte ALERT-1699500000 está en atención',
      message: 'Personal de seguridad ha sido asignado y está trabajando en el caso',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: 2,
      type: 'resuelto',
      title: 'Tu reporte ALERT-1699400000 ha sido resuelto',
      message: 'La fuga de agua fue reparada. Gracias por reportar.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 3,
      type: 'sistema',
      title: 'Recordatorio de seguridad',
      message: 'Si observas algo anómalo, no dudes en reportar de inmediato',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
  ]

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Notificaciones
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border transition-colors ${
                notif.read
                  ? 'bg-secondary/20 border-border'
                  : 'bg-primary/10 border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-1 rounded ${
                  notif.read ? 'bg-muted' : 'bg-primary'
                }`}>
                  <Bell className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 opacity-60">
                    {new Date(notif.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
