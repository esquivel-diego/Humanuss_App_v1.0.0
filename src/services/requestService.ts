// src/services/requestService.ts

import { fetchJson } from '@utils/apiClient'

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

// ✅ Obtiene todas las solicitudes de vacaciones y ausencias del empleado autenticado
export const getAllRequests = async (): Promise<Request[]> => {
  const usuarioRaw = localStorage.getItem('USUARIOLOG') || '[]'
  const usuario = JSON.parse(usuarioRaw)[0]
  const empleadoId = usuario?.id

  if (!empleadoId) throw new Error('ID de empleado no disponible')

  const [vacacionesData, ausenciasData] = await Promise.all([
    fetchJson(`/indicadores?TIPO=VACACION&EMPLEADO_ID=${encodeURIComponent(empleadoId)}`),
    fetchJson(`/indicadores?TIPO=AUSENCIA&EMPLEADO_ID=${encodeURIComponent(empleadoId)}`),
  ])

  const mappedVac: Request[] = (vacacionesData.recordset ?? []).map((v: any) => ({
    id: v.VACACION_ID,
    userId: v.EMPLEADO_ID,
    type: 'Vacación',
    date: v.FECHA_SOLICITUD,
    range: `${v.FECHA_INICIO} al ${v.FECHA_FIN}`,
    notes: v.OBSERVACION,
    status: (v.ESTADO ?? 'pendiente').toLowerCase() as RequestStatus,
  }))

  const mappedAus: Request[] = (ausenciasData.recordset ?? []).map((a: any) => ({
    id: a.AUSENCIA_ID,
    userId: a.EMPLEADO_ID,
    type: 'Permiso',
    date: a.FECHA_SOLICITUD,
    range: `${a.FECHA_INICIO} al ${a.FECHA_FIN}`,
    notes: a.OBSERVACION,
    status: (a.ESTADO ?? 'pendiente').toLowerCase() as RequestStatus,
  }))

  return [...mappedVac, ...mappedAus]
}

// ✅ Envía una solicitud real de Vacación o Permiso
export const createRequest = async (request: {
  type: 'Vacación' | 'Permiso'
  date: string
  range: string
  notes?: string
}): Promise<void> => {
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

  const endpoint = request.type === 'Vacación' ? 'vacacion_solicitud' : 'ausencia_solicitud_movil'

  const res = await fetch(`/api_demo2/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Error al enviar solicitud:', text)
    throw new Error('No se pudo enviar la solicitud')
  }
}

// 🧪 Solo para entorno local o modo mock
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
