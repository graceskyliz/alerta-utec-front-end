'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import type { UserRole, Incident } from '@/lib/types'

interface AdminPanelProps {
  role: UserRole
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'seguridad',
    location: 'Edificio A',
    description: 'Puerta abierta sin autorización',
    urgency: 'alta',
    status: 'pendiente',
    reporterId: 'user-1',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(),
    assignedTo: undefined,
  },
  {
    id: '2',
    type: 'infraestructura',
    location: 'Biblioteca',
    description: 'Fuga de agua',
    urgency: 'media',
    status: 'en_atención',
    reporterId: 'user-2',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(),
    assignedTo: 'admin-1',
  },
]

export function AdminPanel({ role }: AdminPanelProps) {
  const [incidents, setIncidents] = useState(mockIncidents)

  const handleStatusChange = (id: string, newStatus: string) => {
    setIncidents(incidents.map(i => 
      i.id === id ? { ...i, status: newStatus as any, updatedAt: new Date() } : i
    ))
  }

  const stats = {
    total: incidents.length,
    pendiente: incidents.filter(i => i.status === 'pendiente').length,
    en_atencion: incidents.filter(i => i.status === 'en_atención').length,
    resuelto: incidents.filter(i => i.status === 'resuelto').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendiente}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En atención</p>
                <p className="text-2xl font-bold text-blue-400">{stats.en_atencion}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resueltos</p>
                <p className="text-2xl font-bold text-green-400">{stats.resuelto}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Incidentes Reportados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground capitalize">{incident.type} - {incident.location}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                  </div>
                  <Badge variant={incident.urgency === 'alta' ? 'destructive' : 'secondary'}>
                    {incident.urgency}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['pendiente', 'en_atención', 'resuelto'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={incident.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(incident.id, status === 'en_atención' ? 'en_atención' : status)}
                      className={incident.status === status ? 'bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'}
                    >
                      {status === 'en_atención' ? 'En atención' : status}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
