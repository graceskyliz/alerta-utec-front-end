'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Lock, Mail, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authApi } from '@/lib/api'

interface LoginFormProps {
  onLogin: () => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
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

    try {
      const response = await authApi.login(email, password)
      if (response.token) {
        onLogin()
      } else {
        setError(response.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.')
      console.log('[v0] Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    setIsLoading(true)
    setError('')
    
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos')
      setIsLoading(false)
      return
    }

    try {
      const response = await authApi.register(name, email, password)
      if (response.token) {
        onLogin()
      } else {
        setError(response.error || 'Error al registrarse')
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.')
      console.log('[v0] Register error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AlertaUTEC</h1>
          </div>
          <p className="text-muted-foreground">Sistema de reportes de incidentes</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Bienvenido Estudiante</CardTitle>
                <CardDescription>Usa tus credenciales institucionales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground">Correo</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@universidad.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Crear Cuenta</CardTitle>
                <CardDescription>Regístrate para reportar incidentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-foreground">Nombre Completo</Label>
                  <Input
                    id="register-name"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-foreground">Correo</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@universidad.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-foreground">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Plataforma 100% serverless para gestionar incidentes
        </p>
      </div>
    </div>
  )
}
