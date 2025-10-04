// src/services/employeeService.ts
import { fetchJson } from '@utils/apiClient'

/** ====== Local backend (opcional) ====== */
export type Empleado = {
  id: string
  name: string
}

/**
 * Usa backend local SOLO si VITE_USE_LOCAL_REQUESTS === 'true'.
 * Si no, retorna [] para evitar errores cuando localhost:4000 no está levantado.
 */
export const getAllEmployees = async (): Promise<Empleado[]> => {
  const useLocal = (import.meta as any).env?.VITE_USE_LOCAL_REQUESTS === 'true'
  if (!useLocal) return []

  try {
    const res = await fetchJson('/empleados', {
      skipToken: true,
      forceLocal: true,
    })
    return res.recordset ?? []
  } catch {
    return []
  }
}

/** ====== API oficial v2: empleado autenticado ====== */
type FotoBuffer = { type: 'Buffer'; data: number[] }

export type ApiEmployeeV2Record = {
  NOMBRE_USUAL: string
  DESCRIPCION_PUESTO?: string
  FOTO?: FotoBuffer | null
  DIRECCION_EMAIL?: string
  TELEFONO?: string
  DIRECCION_DOMICILIO?: string
  ROL?: string
}

type ApiEmployeeV2Response = {
  ok: boolean
  rowsAffected: number
  recordset: ApiEmployeeV2Record[]
}

/**
 * Convierte el {type:'Buffer', data:number[]} que envía el backend a data URL base64.
 * Asumimos PNG (encabezado 137 80 78 71). Si no, igual usamos image/png como fallback.
 */
const bufferToDataUrl = (foto?: FotoBuffer | null): string => {
  if (!foto || !Array.isArray(foto.data) || foto.data.length === 0) return ''
  try {
    const uint = new Uint8Array(foto.data)
    // Convertimos a base64 en bloques para evitar overflow del stack en imágenes grandes
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < uint.length; i += chunkSize) {
      binary += String.fromCharCode(...uint.subarray(i, i + chunkSize))
    }
    const base64 = btoa(binary)
    return `data:image/png;base64,${base64}`
  } catch {
    return ''
  }
}

/**
 * Obtiene el empleado autenticado desde /v2/EMPLEADO (apiClient agrega ?token=).
 */
export const getAuthenticatedEmployeeV2 = async (): Promise<{
  record: ApiEmployeeV2Record | null
  photoDataUrl: string
}> => {
  const data = await fetchJson<ApiEmployeeV2Response>('/v2/EMPLEADO')
  const rec = data?.recordset?.[0] ?? null
  const photoDataUrl = bufferToDataUrl(rec?.FOTO ?? null)
  return { record: rec, photoDataUrl }
}
