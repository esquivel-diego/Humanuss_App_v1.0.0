import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  allowedRoles?: ('admin' | 'employee')[]
}

export default function PrivateRoute({ children, allowedRoles }: Props) {
  const user = useAuthStore((state) => state.user)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
