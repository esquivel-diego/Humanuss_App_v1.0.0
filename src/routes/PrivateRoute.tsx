import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function PrivateRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Espera un frame para permitir a Zustand hidratar desde localStorage
    const timer = setTimeout(() => setIsReady(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!isReady) return null // ⏳ Espera para evitar redirección errónea

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
