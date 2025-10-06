import { fetchJson } from "@utils/apiClient"

export type MarcajeTipo = "E" | "S"

/** Body oficial v2 */
export interface MarcajeV2Body {
  LATITUD: number | null
  LONGITUD: number | null
  ID_DISPOSITIVO: string
  ENTRADASALIDA: string // "001" para entrada, "" para salida
  FECHA_REGISTRO: string // ISO UTC con Z, e.g. "2025-10-05T06:39:04.000Z"
}

/** Genera fecha en ISO UTC con 'Z' */
export const isoNowUtc = () => new Date().toISOString()

/** POST oficial: /v2/MARCAJE  (apiClient antepone /api/portal y agrega ?token=...) */
export const postMarcajeV2 = async (data: MarcajeV2Body): Promise<any> => {
  const res = await fetchJson("/v2/MARCAJE", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return res
}

export interface DayAttendance {
  FECHA?: string
  HORA_ENTRADA?: string | null
  HORA_SALIDA?: string | null
}

/** YYYY-MM-DD usando **hora local** */
export const toLocalYMD = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** YYYY-MM-DD usando **UTC** (fallback) */
export const toUtcYMD = (d = new Date()) => {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** GET asistencia: /v2/ASISTENCIA/:from/:to  (apiClient antepone /api/portal y agrega ?token=...) */
export const getAsistenciaDeHoy = async (now = new Date()): Promise<DayAttendance | null> => {
  const local = toLocalYMD(now)
  const utc = toUtcYMD(now)

  const tryFetch = async (ymd: string) => {
    const r = await fetchJson<{ ok: boolean; recordset?: any[] }>(`/v2/ASISTENCIA/${ymd}/${ymd}`)
    return r?.recordset?.[0] ?? null
  }

  let rec = await tryFetch(local)
  console.log("ℹ️ Backend asistencia (LOCAL):", local, rec)

  if (!rec) {
    rec = await tryFetch(utc)
    console.log("ℹ️ Backend asistencia (UTC):", utc, rec)
  }

  return rec
}
