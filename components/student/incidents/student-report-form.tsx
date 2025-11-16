'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, MapPin, FileText, CheckCircle, Camera } from 'lucide-react'

interface StudentReportFormProps {
  studentId: string
}

export function StudentReportForm({ studentId }: StudentReportFormProps) {
  const [formData, setFormData] = useState({
    type: 'seguridad',
    location: '',
    description: '',
    urgency: 'media',
    anonymous: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reportId, setReportId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const newReportId = 'ALERT-' + Date.now().toString(36).toUpperCase()
      setReportId(newReportId)
      setIsLoading(false)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ 
          type: 'seguridad', 
          location: '', 
          description: '', 
          urgency: 'media',
          anonymous: false 
        })
      }, 4000)
    }, 1200)
  }

  if (submitted) {
    return (
      <Card className="bg-card border-border max-w-2xl mx-auto shadow-lg">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Reporte Enviado</h3>
            <p className="text-muted-foreground">
              Tu incidente ha sido registrado correctamente. Las autoridades serán notificadas de inmediato.
            </p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">ID de Seguimiento</p>
            <p className="text-lg font-mono text-primary font-bold">{reportId}</p>
            <p className="text-xs text-muted-foreground mt-2">Guarda este código para seguir tu caso</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Recibirás actualizaciones por correo electrónico
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent" />
          Reportar Nuevo Incidente
        </CardTitle>
        <CardDescription>
          Proporciona toda la información que consideres importante para que podamos actuar rápido
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground font-semibold">Tipo de Incidente *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="seguridad">🔒 Seguridad / Robo</option>
              <option value="infraestructura">🏗️ Infraestructura / Daño</option>
              <option value="accidente">⚠️ Accidente / Lesión</option>
              <option value="otro">📋 Otro</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-semibold">Ubicación *</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Ej: Edificio A, Segundo piso, cerca de biblioteca"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-input border-border text-foreground pl-12"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-semibold">Descripción Detallada *</Label>
            <textarea
              id="description"
              placeholder="Cuéntanos qué sucedió, cuándo, quiénes estaban involucrados, testigos, etc. Mayor detalle = mejor respuesta"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length} caracteres
            </p>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label htmlFor="urgency" className="text-foreground font-semibold">Nivel de Urgencia *</Label>
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="baja">🟢 Baja - Puede esperar</option>
              <option value="media">🟡 Media - Dentro de horas</option>
              <option value="alta">🔴 Alta - Inmediato</option>
              <option value="crítica">⚫ Crítica - Riesgo de vida</option>
            </select>
          </div>

          {/* Anonymous */}
          <div className="flex items-center gap-3 bg-secondary/30 border border-border rounded-lg p-4">
            <input
              id="anonymous"
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer accent-primary"
            />
            <label htmlFor="anonymous" className="cursor-pointer flex-1">
              <p className="font-medium text-foreground text-sm">Reportar de forma anónima</p>
              <p className="text-xs text-muted-foreground">No revelaremos tu identidad</p>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
          >
            {isLoading ? 'Enviando reporte...' : 'Enviar Reporte'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Todos los reportes son confidenciales y tratados por las autoridades correspondientes
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
