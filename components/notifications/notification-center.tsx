'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import type { Notification, Incident } from '@/lib/types'
import { IncidentWebSocket } from '@/lib/websocket'
import { studentIncidentsApi } from '@/lib/api'
import { ToastContainer, Toast } from '@/components/ui/toast'

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [wsDisabled, setWsDisabled] = useState(false)
  const wsRef = useRef<IncidentWebSocket | null>(null)
  const previousIncidentsRef = useRef<Map<string, Incident>>(new Map())
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // WebSocket or polling setup
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    const userId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}').id : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

    if (!userId || !token) {
      console.warn('⚠️ No user ID or token found, notifications disabled')
      return
    }

    // Try WebSocket first if URL is configured
    if (wsUrl && !wsDisabled) {
      console.log('🔌 Initializing WebSocket notifications')
      
      const ws = new IncidentWebSocket(wsUrl, userId, token, {
        onStatusChanged: handleStatusChange,
        onCommentAdded: handleCommentAdded,
        onDepartmentAssigned: handleDepartmentAssigned,
        onConnect: () => {
          console.log('✅ WebSocket connected, real-time notifications active')
        },
        onDisconnect: () => {
          console.log('⚠️ WebSocket disconnected')
        },
        onError: (error) => {
          console.error('❌ WebSocket error, falling back to polling:', error)
          setWsDisabled(true)
        }
      })

      ws.connect()
      wsRef.current = ws

      return () => {
        ws.disconnect()
      }
    } else {
      // Fallback to polling
      console.log('📊 Using polling for notifications (every 15s)')
      
      const pollIncidents = async () => {
        try {
          const response = await studentIncidentsApi.getMine()
          if (response?.data && Array.isArray(response.data)) {
            checkForUpdates(response.data)
          }
        } catch (err) {
          console.error('Error polling incidents:', err)
        }
      }

      // Poll immediately and then every 15 seconds
      pollIncidents()
      pollingIntervalRef.current = setInterval(pollIncidents, 15000)

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    }
  }, [wsDisabled])

  const checkForUpdates = (apiIncidents: any[]) => {
    const currentIncidents = new Map<string, {
      id: string
      status: string
      assignedTo: string | null
      notes: string | null
    }>(
      apiIncidents.map(inc => [inc.incident_id, {
        id: inc.incident_id,
        status: inc.estado,
        assignedTo: inc.assigned_to,
        notes: inc.notas
      }])
    )

    // Compare with previous state
    currentIncidents.forEach((current, id) => {
      const previous = previousIncidentsRef.current.get(id)
      
      if (previous) {
        // Status changed
        if (previous.status !== current.status) {
          handleStatusChange(id, current.status, current)
        }
        
        // Department assigned
        if (!previous.assignedTo && current.assignedTo) {
          handleDepartmentAssigned(id, current.assignedTo, current)
        }
        
        // Notes added (comment)
        if (previous.notes !== current.notes && current.notes) {
          handleCommentAdded(id, current.notes, current)
        }
      }
    })

    previousIncidentsRef.current = currentIncidents as any
  }

  const handleStatusChange = (incidentId: string, newStatus: string, data: any) => {
    const notification: Notification = {
      id: `status-${incidentId}-${Date.now()}`,
      message: `Tu incidente #${incidentId.slice(0, 8)} cambió a: ${newStatus}`,
      type: newStatus === 'resuelto' ? 'success' : 'info',
      read: false,
      createdAt: new Date()
    }

    setNotifications(prev => [notification, ...prev])
    addToast(notification.message, notification.type)
    playNotificationSound()
  }

  const handleCommentAdded = (incidentId: string, comment: string, data: any) => {
    const notification: Notification = {
      id: `comment-${incidentId}-${Date.now()}`,
      message: `Nuevo comentario en #${incidentId.slice(0, 8)}: ${comment.slice(0, 50)}...`,
      type: 'info',
      read: false,
      createdAt: new Date()
    }

    setNotifications(prev => [notification, ...prev])
    addToast(notification.message, 'info')
    playNotificationSound()
  }

  const handleDepartmentAssigned = (incidentId: string, department: string, data: any) => {
    const notification: Notification = {
      id: `dept-${incidentId}-${Date.now()}`,
      message: `Tu incidente #${incidentId.slice(0, 8)} fue asignado a: ${department}`,
      type: 'warning',
      read: false,
      createdAt: new Date()
    }

    setNotifications(prev => [notification, ...prev])
    addToast(notification.message, 'warning')
    playNotificationSound()
  }

  const addToast = (message: string, type: Toast['type']) => {
    const toast: Toast = {
      id: `toast-${Date.now()}`,
      message,
      type,
      duration: 5000
    }
    setToasts(prev => [...prev, toast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.1

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (err) {
      console.warn('Could not play notification sound:', err)
    }
  }

  if (notifications.length === 0) {
    return (
      <>
        <div className="fixed right-4 top-20 w-96 bg-card border border-border rounded-lg shadow-lg z-40 p-6 text-center">
          <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No hay notificaciones</p>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </>
    )
  }

  return (
    <>
      <div className="fixed right-4 top-20 w-96 max-h-96 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-40">
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h3 className="font-semibold text-foreground">Notificaciones</h3>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
            {notifications.filter(n => !n.read).length}
          </span>
        </div>

        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.read ? 'bg-secondary/20' : 'opacity-75'
              }`}
            >
              <p className="text-sm font-medium text-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.createdAt).toLocaleString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}
