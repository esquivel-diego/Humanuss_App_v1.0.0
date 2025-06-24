// src/services/requestService.ts
import type { User } from './authService'

export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada'

export type Request = {
  id: number
  userId: string
  name?: string
  type: string
  date: string
  range?: string
  notes?: string
  status: RequestStatus
}

const API_URL = import.meta.env.VITE_API_URL

/**
 * Obtiene todas las solicitudes del usuario autenticado
 */
export const getAllRequests = async (
  token: string,
  empleadoId: string
): Promise<Request[]> => {
  const [vacaciones, ausencias] = await Promise.all([
    fetch(`${API_URL}/empleado_vacacion/${empleadoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${API_URL}/ausencia_solicitud_movil/${empleadoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  ])

  const vacData = await vacaciones.json()
  const ausData = await ausencias.json()

  const mappedVac: Request[] = vacData.recordset.map((v: any) => ({
    id: v.VACACION_ID,
    userId: v.EMPLEADO_ID,
    type: 'Vacación',
    date: v.FECHA_SOLICITUD,
    range: `${v.FECHA_INICIO} al ${v.FECHA_FIN}`,
    notes: v.OBSERVACION,
    status: v.ESTADO.toLowerCase() as RequestStatus
  }))

  const mappedAus: Request[] = ausData.recordset.map((a: any) => ({
    id: a.AUSENCIA_ID,
    userId: a.EMPLEADO_ID,
    type: 'Permiso',
    date: a.FECHA_SOLICITUD,
    range: `${a.FECHA_INICIO} al ${a.FECHA_FIN}`,
    notes: a.OBSERVACION,
    status: a.ESTADO.toLowerCase() as RequestStatus
  }))

  return [...mappedVac, ...mappedAus]
}

/**
 * Crea una nueva solicitud de vacaciones o permiso
 */
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
            DIAS_CURSO_SOL: 0
          }
        }
      : {
          ausencia: {
            FECHA_AUSENTE_I_SOL: start,
            FECHA_AUSENTE_F_SOL: end,
            TIPO_SOLICITUD: 'Permiso',
            OBSERVACIONES1: request.notes ?? ''
          }
        }

  const endpoint =
    request.type === 'Vacación' ? 'vacacion_solicitud' : 'ausencia_solicitud_movil'

  await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify(payload)
  })
}

/**
 * [MVP-only] Simula aprobación o rechazo en AdminRequest
 */
export const updateRequestStatus = (
  id: number,
  newStatus: RequestStatus
): Request[] => {
  const raw = localStorage.getItem('hr_requests') || '[]'
  const existing = JSON.parse(raw)
  const updated = existing.map((r: Request) =>
    r.id === id ? { ...r, status: newStatus } : r
  )
  localStorage.setItem('hr_requests', JSON.stringify(updated))
  return updated
}
