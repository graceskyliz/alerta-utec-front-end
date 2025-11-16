'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import type { Notification } from '@/lib/types'

const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Tu reporte #ALERT-2024-0042 ha sido asignado a un responsable',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: '2',
    message: 'Nuevo incidente de ALTA urgencia reportado en Edificio B',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    message: 'El incidente #ALERT-2024-0040 ha sido resuelto',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    case 'error':
      return 'bg-red-500/10 border-red-500/30 text-red-400'
    case 'success':
      return 'bg-green-500/10 border-green-500/30 text-green-400'
    default:
      return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
  }
}

export function NotificationCenter() {
  return (
    <div className="fixed right-4 top-20 w-96 max-h-96 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-40">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
        <h3 className="font-semibold text-foreground">Notificaciones</h3>
      </div>

      <div className="divide-y divide-border">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
              !notification.read ? 'bg-secondary/20' : 'opacity-75'
            }`}
          >
            <p className="text-sm font-medium text-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {notification.createdAt.toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
