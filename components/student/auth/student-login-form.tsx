'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Lock, Mail, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface StudentLoginFormProps {
  onLogin: (studentId: string, name: string) => void
}

export function StudentLoginForm({ onLogin }: StudentLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      setIsLoading(false)
      onLogin('EST-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(), email.split('@')[0])
    }, 800)
  }

  const handleRegister = async () => {
    setIsLoading(true)
    setError('')
    
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos')
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      setIsLoading(false)
      onLogin('EST-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(), name)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AlertaUTEC</h1>
          </div>
          <p className="text-muted-foreground text-sm">Portal de estudiantes para reportar incidentes</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="space-y-2">
                <CardTitle className="text-foreground">Bienvenido de vuelta</CardTitle>
                <CardDescription>Accede con tu cuenta institucional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground text-sm font-medium">Correo institucional</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@universidad.edu.do"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground text-sm font-medium">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  ¿Olvidaste tu contraseña?{' '}
                  <a href="#" className="text-primary hover:underline">
                    Recuperar aquí
                  </a>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="space-y-2">
                <CardTitle className="text-foreground">Crear tu cuenta</CardTitle>
                <CardDescription>Únete a AlertaUTEC para reportar incidentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-foreground text-sm font-medium">Nombre completo</Label>
                  <Input
                    id="register-name"
                    placeholder="Juan Pérez García"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-foreground text-sm font-medium">Correo institucional</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@universidad.edu.do"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-foreground text-sm font-medium">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="bg-secondary/30 border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Al registrarte aceptas los términos de servicio y la política de privacidad de AlertaUTEC
                  </p>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                >
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-xs text-muted-foreground space-y-2">
          <p>Reporta incidentes en tu campus de forma segura y anónima</p>
          <p className="font-medium text-primary">Tu voz es importante para nuestra comunidad</p>
        </div>
      </div>
    </div>
  )
}
