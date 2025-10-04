import { fetchJson } from "@utils/apiClient"

export type MarcajeTipo = "E" | "S"

export interface MarcajeV2Body {
  LATITUD: number | null
  LONGITUD: number | null
  ID_DISPOSITIVO: string
  ENTRADASALIDA: MarcajeTipo
  FECHA_REGISTRO: string // YYYY-MM-DD (LOCAL)
}

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

/** Intenta leer asistencia para fecha local; si no hay, intenta UTC; si no, null */
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
