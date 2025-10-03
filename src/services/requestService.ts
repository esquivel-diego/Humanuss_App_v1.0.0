// src/services/requestService.ts
import { fetchJson } from '@utils/apiClient'
import type { User } from './authService'
import type { Request, RequestStatus } from '../types/requestTypes'

export const getAllRequests = async (user?: User): Promise<Request[]> => {
  // Evita llamadas al backend local por defecto
  const useLocal = (import.meta as any).env?.VITE_USE_LOCAL_REQUESTS === 'true'
  if (!useLocal) return []

  if (!user || !user.id) return []
  try {
    const res = await fetchJson(`/solicitudes?empleadoId=${user.id}`, {
      skipToken: true,
      forceLocal: true,
    })
    if (!res || !Array.isArray(res.recordset)) return []
    return res.recordset as Request[]
  } catch {
    return []
  }
}

export const createRequest = async (
  user: User,
  request: {
    type: string
    date: string
    range: string
    notes?: string
    daysToTake?: number
  }
): Promise<void> => {
  const localRequest = {
    userId: user.id,
    type: request.type,
    date: request.date,
    range: request.range,
    notes: request.notes,
    daysToTake: request.daysToTake ?? 0,
    status: 'pendiente',
  }

  await fetchJson('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(localRequest),
    skipToken: true,
    forceLocal: true,
  })
}

export type { Request, RequestStatus }
