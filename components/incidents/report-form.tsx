'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, MapPin, FileText, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { studentIncidentsApi } from '@/lib/api'

interface ReportFormProps {
  onSuccess?: () => void
}

export function ReportForm({ onSuccess }: ReportFormProps) {
  const [formData, setFormData] = useState({
    type: 'seguridad',
    location: '',
    description: '',
    urgency: 'media',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [incidentId, setIncidentId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await studentIncidentsApi.create({
        type: formData.type,
        location: formData.location,
        description: formData.description,
        urgency: formData.urgency,
      })

      if (response.data) {
        setIncidentId(response.data.id)
        setSubmitted(true)
        onSuccess?.()
        
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ type: 'seguridad', location: '', description: '', urgency: 'media' })
        }, 3000)
      } else {
        setError(response.error || 'Error al reportar incidente')
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.')
      console.log('[v0] Submit error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="bg-card border-border max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground">Incidente Reportado</h3>
          <p className="text-muted-foreground">
            Tu reporte ha sido enviado correctamente. Las autoridades serán notificadas inmediatamente.
          </p>
          <p className="text-sm text-muted-foreground">ID de reporte: <span className="font-mono text-primary">#{incidentId}</span></p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent" />
          Reportar Nuevo Incidente
        </CardTitle>
        <CardDescription>Proporciona detalles claros del incidente para una respuesta rápida</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">Tipo de Incidente *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              <option value="seguridad">🔒 Seguridad</option>
              <option value="infraestructura">🏗️ Infraestructura</option>
              <option value="accidente">⚠️ Accidente</option>
              <option value="otro">📋 Otro</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">Ubicación *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Ej: Edificio A, Segundo piso"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-input border-border text-foreground pl-10"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Descripción *</Label>
            <textarea
              id="description"
              placeholder="Describe lo que sucedió con el máximo detalle posible..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
              required
            />
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label htmlFor="urgency" className="text-foreground">Nivel de Urgencia *</Label>
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              <option value="baja">🟢 Baja</option>
              <option value="media">🟡 Media</option>
              <option value="alta">🔴 Alta</option>
              <option value="crítica">⚫ Crítica</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isLoading ? 'Enviando...' : 'Enviar Reporte'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
