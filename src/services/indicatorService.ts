// src/services/indicatorService.ts
import { fetchJson } from '@utils/apiClient'
import { sanitizeId } from '@utils/format'
import type { User } from './authService'

export type VacationIndicator = {
  cantidad: number
  diasGozados: number
  diasPagados: number
  leyenda: string
}

/**
 * ⚠️ Legacy (v1): se mantiene por compatibilidad.
 * /indicadores?TIPO=VACACION&EMPLEADO_ID=...
 */
export const getVacationIndicators = async (user: User): Promise<VacationIndicator | null> => {
  const cleanedId = sanitizeId(user.id)
  const data = await fetchJson(`/indicadores?TIPO=VACACION&EMPLEADO_ID=${cleanedId}`)
  const record = data?.recordset?.[0]

  if (!record) return null

  return {
    cantidad: record.CANTIDAD ?? 0,
    diasGozados: record.DIAS_GOZADOS ?? 0,
    diasPagados: record.DIAS_PAGADOS ?? 0,
    leyenda: record.LEYENDA ?? 'N/A',
  }
}

/** ---------- NUEVO (v2) ---------- */

export type RecentDaysRecord = {
  DIAS_TOTALES: number
  DIAS_TOMADOS: number
  DIAS_DISPONIBLES: number
  FECHA_SOLICITUD_ULTIMA: string | null
  FECHA_INICIO_ULTIMA: string | null
  FECHA_FIN_ULTIMA: string | null
  PERIODO_AAMMNO: string // ISO date string
}

export type RecentDaysResponse = {
  ok: boolean
  rowsAffected: number
  recordset: RecentDaysRecord[]
}

/**
 * Obtiene los indicadores de días desde /v2/INDICADORES/DIAS (NUMERO_REGISTROS=12),
 * y devuelve **solo el período más reciente**.
 * NOTA: No incluir ?token= en el path. apiClient lo agrega automáticamente.
 */
export const getRecentVacationDaysV2 = async (): Promise<RecentDaysRecord | null> => {
  const data = await fetchJson<RecentDaysResponse>(`/v2/INDICADORES/DIAS?NUMERO_REGISTROS=12`)
  const list = data?.recordset ?? []
  if (!Array.isArray(list) || list.length === 0) return null

  const mostRecent = [...list].sort(
    (a, b) => new Date(b.PERIODO_AAMMNO).getTime() - new Date(a.PERIODO_AAMMNO).getTime()
  )[0]

  return mostRecent ?? null
}

/** ---------- NUEVO: Solicitudes (tabla DaysTable) ---------- */

export type RequestIndicatorRecord = {
  NUMERO: number
  TIPO: string
  FECHA: string // ISO
  ESTADO: string // 'A' | 'R' | otros
}

type RequestIndicatorsResponse = {
  ok: boolean
  rowsAffected: number
  recordset: RequestIndicatorRecord[]
}

/**
 * Llama a /INDICADORES/SOLICITUDES y retorna el recordset (sin token en el path).
 */
export const getRequestIndicators = async (): Promise<RequestIndicatorRecord[]> => {
  const data = await fetchJson<RequestIndicatorsResponse>(`/INDICADORES/SOLICITUDES`)
  const list = data?.recordset ?? []
  if (!Array.isArray(list)) return []
  return list
}
