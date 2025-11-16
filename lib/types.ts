export type UserRole = 'estudiante'

export interface Incident {
  id: string
  type: 'seguridad' | 'infraestructura' | 'accidente' | 'otro'
  location: string
  description: string
  urgency: 'baja' | 'media' | 'alta' | 'crítica'
  status: 'pendiente' | 'en_atención' | 'resuelto'
  reporterId: string
  createdAt: string | Date
  updatedAt: string | Date
  assignedTo?: string
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string | Date
}

export interface Notification {
  id: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string | Date
}
