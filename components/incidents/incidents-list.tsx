'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, AlertTriangle } from 'lucide-react'
import type { Incident } from '@/lib/types'

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'seguridad',
    location: 'Edificio A, Tercer piso',
    description: 'Puerta de acceso abierta sin autorización',
    urgency: 'alta',
    status: 'en_atención',
    reporterId: 'user-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    type: 'infraestructura',
    location: 'Biblioteca',
    description: 'Fuga de agua en el techo',
    urgency: 'media',
    status: 'pendiente',
    reporterId: 'user-2',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'accidente',
    location: 'Estacionamiento B',
    description: 'Accidente de tránsito en el ingreso',
    urgency: 'alta',
    status: 'resuelto',
    reporterId: 'user-3',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'bg-yellow-500/20 text-yellow-300'
    case 'en_atención':
      return 'bg-blue-500/20 text-blue-300'
    case 'resuelto':
      return 'bg-green-500/20 text-green-300'
    default:
      return 'bg-gray-500/20 text-gray-300'
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
      return '⚪'
  }
}

export function IncidentsList() {
  const [incidents] = useState(mockIncidents)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{incidents.length}</div>
            <p className="text-sm text-muted-foreground">Total de reportes</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{incidents.filter(i => i.status === 'pendiente').length}</div>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{incidents.filter(i => i.urgency === 'crítica' || i.urgency === 'alta').length}</div>
            <p className="text-sm text-muted-foreground">De alta urgencia</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <Card key={incident.id} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getUrgencyColor(incident.urgency)}</span>
                      <h3 className="font-semibold text-foreground capitalize">{incident.type}</h3>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status === 'en_atención' ? 'En atención' : incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {incident.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {incident.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {incident.notes && (
                  <div className="bg-secondary p-3 rounded-md">
                    <p className="text-xs font-semibold text-foreground mb-1">Notas:</p>
                    <p className="text-xs text-muted-foreground">{incident.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
