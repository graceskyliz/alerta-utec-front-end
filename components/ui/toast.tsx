'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-600'
      case 'error':
        return 'bg-red-500/90 border-red-600'
      case 'warning':
        return 'bg-yellow-500/90 border-yellow-600'
      case 'info':
        return 'bg-blue-500/90 border-blue-600'
      default:
        return 'bg-gray-500/90 border-gray-600'
    }
  }

  return (
    <div
      className={`${getToastStyles(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg border flex items-center justify-between gap-3 min-w-[300px] max-w-[400px] animate-slide-in-right`}
    >
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
