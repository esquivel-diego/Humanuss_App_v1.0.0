// src/services/requestService.ts

import { fetchJson } from '@utils/apiClient'
import type { User } from './authService'
import type { Request, RequestStatus } from '../types/requestTypes'

export const getAllRequests = async (user: User): Promise<Request[]> => {
  if (!user || !user.id) throw new Error("Usuario inválido")

  const res = await fetchJson(`/solicitudes?empleadoId=${user.id}`)
  if (!res || !Array.isArray(res.recordset)) {
    console.warn('⚠️ Respuesta inesperada al obtener solicitudes:', res)
    return []
  }

  return res.recordset
}

export const createRequest = async (
  user: User,
  request: {
    type: 'Vacación' | 'Permiso'
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
