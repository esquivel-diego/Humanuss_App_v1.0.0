// src/services/requestService.ts

import { fetchJson } from '@utils/apiClient'
import type { User } from './authService'
import type { Request, RequestStatus } from '../types/requestTypes'

// ✅ Obtener historial de solicitudes (vacaciones y permisos)
export const getAllRequests = async (user: User): Promise<Request[]> => {
  if (!user || !user.id) throw new Error("Usuario inválido")

  const res = await fetchJson(`/solicitudes?empleadoId=${user.id}`)
  if (!res || !Array.isArray(res.recordset)) {
    console.warn('⚠️ Respuesta inesperada al obtener solicitudes:', res)
    return []
  }

  return res.recordset
}

// ✅ Crear nueva solicitud (vacación o permiso)
export const createRequest = async (
  user: User,
  request: {
    type: 'Vacación' | 'Permiso'
    date: string
    range: string
    notes?: string
  }
): Promise<void> => {
  const [start, end] = request.range.split(' al ')

  const payload =
    request.type === 'Vacación'
      ? {
          vacacion: {
            FECHA_SOLICITUD: request.date,
            FECHA_INICIO_SOL: start,
            FECHA_FIN_SOL: end,
            FECHA_LABOR_SOL: end,
            OBSERVACIONES1: request.notes ?? '',
            DIAS_PAGADOS_SOL: 0,
            DIAS_GOZAR_SOL: 0,
            DIAS_CURSO_SOL: 0,
          },
        }
      : {
          ausencia: {
            FECHA_AUSENTE_I_SOL: start,
            FECHA_AUSENTE_F_SOL: end,
            TIPO_SOLICITUD: 'Permiso',
            OBSERVACIONES1: request.notes ?? '',
          },
        }

  const endpoint =
    request.type === 'Vacación'
      ? '/VACACION_SOLICITUD_portal'
      : '/AUSENCIA_SOLICITUD_portal'

  const response = await fetch(
    `https://nominapayone.com/api_demo2/api/portal${endpoint}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    console.error('❌ Error al enviar solicitud oficial:', text)
    throw new Error('No se pudo enviar la solicitud oficial')
  }

  // ✅ Guardar en el backend propio sin enviar token
  const localRequest = {
    userId: user.id,
    type: request.type,
    date: request.date,
    range: request.range,
    notes: request.notes,
    status: 'pendiente',
  }

  await fetchJson('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(localRequest),
    skipToken: true, // ← esto solo funcionará si lo agregas a tu `apiClient.ts`
  })
}

export type { Request, RequestStatus }
