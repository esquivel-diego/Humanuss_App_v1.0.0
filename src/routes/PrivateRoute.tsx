import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function PrivateRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
