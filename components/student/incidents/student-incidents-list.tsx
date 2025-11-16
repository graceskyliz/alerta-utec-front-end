'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, AlertCircle } from 'lucide-react'

interface StudentIncidentsListProps {
  studentId: string
}

export function StudentIncidentsList({ studentId }: StudentIncidentsListProps) {
  const [incidents] = useState([
    {
      id: 'ALERT-1699500000',
      type: 'seguridad',
      location: 'Estacionamiento B',
      description: 'Intento de robo en el estacionamiento',
      urgency: 'alta',
      status: 'en_atención',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      notes: 'Se ha asignado personal de seguridad al área',
    },
    {
      id: 'ALERT-1699400000',
      type: 'infraestructura',
      location: 'Edificio C, Tercer piso',
      description: 'Fuga de agua en el baño de estudiantes',
      urgency: 'media',
      status: 'resuelto',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      notes: 'Reparación completada. Área limpia y segura',
    },
    {
      id: 'ALERT-1699300000',
      type: 'accidente',
      location: 'Cancha de deportes',
      description: 'Estudiante con posible esguince en tobillo',
      urgency: 'alta',
      status: 'resuelto',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 47 * 60 * 60 * 1000),
      notes: 'Enviado a clínica universitaria, se recupera bien',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'en_atención':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'resuelto':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente'
      case 'en_atención':
        return 'En Atención'
      case 'resuelto':
        return 'Resuelto'
      default:
        return status
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'baja':
        return '🟢'
      case 'media':
        return '🟡'
      case 'alta':
        return '🔴'
      case 'crítica':
        return '⚫'
      default:
        return '◯'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      return `hace ${Math.floor(hours / 24)} días`
    } else if (hours > 0) {
      return `hace ${hours}h`
    } else if (minutes > 0) {
      return `hace ${minutes}m`
    }
    return 'Hace poco'
  }

  return (
    <div className="space-y-4">
      {incidents.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="pt-12 text-center pb-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin reportes</h3>
            <p className="text-muted-foreground">Aún no has reportado ningún incidente</p>
          </CardContent>
        </Card>
      ) : (
        incidents.map((incident) => (
          <Card
            key={incident.id}
            className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getUrgencyColor(incident.urgency)}</span>
                    <h3 className="font-semibold text-foreground capitalize">
                      {incident.type.replace('_', ' ')}
                    </h3>
                    <Badge className={getStatusColor(incident.status)}>
                      {getStatusLabel(incident.status)}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{incident.location}</p>

                  <p className="text-foreground text-sm line-clamp-2">
                    {incident.description}
                  </p>

                  {incident.notes && (
                    <div className="bg-secondary/30 border border-border rounded-lg p-3 mt-3">
                      <p className="text-xs font-medium text-foreground mb-1">Actualización:</p>
                      <p className="text-xs text-muted-foreground">{incident.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-4 text-xs text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Reportado: {formatDate(incident.createdAt)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="border-border text-foreground hover:bg-secondary flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
