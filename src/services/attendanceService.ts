// src/services/attendanceService.ts
import { fetchJson } from '@utils/apiClient'

export type AttendanceDay = {
  day: string        // "Lunes", "Martes", ...
  checkIn: string    // "HH:MM" o ''
  checkOut: string   // "HH:MM" o ''
}

export type MarcajeTipo = 'E' | 'S'

export interface MarcajeRequest {
  tipo: MarcajeTipo // 'E' para entrada, 'S' para salida
  fecha: Date       // fecha y hora completa del momento del marcaje
}

/** ---------- Helpers de fechas ---------- */

// YYYY-MM-DD (sin timezone)
const toYMD = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Lunes a domingo de la semana ANTERIOR (semana completa previa)
const getLastWeekRange = (today = new Date()): { start: string; end: string } => {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate()) // 00:00 local
  const diffToMonday = (d.getDay() + 6) % 7 // 0 = lunes, 6 = domingo
  const thisMonday = new Date(d)
  thisMonday.setDate(d.getDate() - diffToMonday)

  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(thisMonday.getDate() - 7)
  const lastSunday = new Date(lastMonday)
  lastSunday.setDate(lastMonday.getDate() + 6)

  return { start: toYMD(lastMonday), end: toYMD(lastSunday) }
}

const getDayNameEs = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long' })
    .format(date)
    .replace(/^\w/u, (c) => c.toUpperCase())

// De "1970-01-01T07:22:19.000Z" a "07:22" (evitamos TZ tomando la parte HH:MM)
const isoTimeToHHMM = (iso?: string | null): string => {
  if (!iso || typeof iso !== 'string' || iso.length < 16) return ''
  return iso.slice(11, 16)
}

/** ---------- API v2: asistencia por rango (última semana completa) ---------- */
export const getWeeklyAttendance = async (): Promise<AttendanceDay[]> => {
  const { start, end } = getLastWeekRange()

  // Pedimos la asistencia de la ÚLTIMA semana (lunes-domingo previos)
  const data = await fetchJson<{ ok: boolean; recordset?: any[] }>(
    `/v2/ASISTENCIA/${start}/${end}`
  )
  const list = data?.recordset ?? []

  // Indexamos por fecha YYYY-MM-DD
  const byDate: Record<string, { in: string; out: string }> = {}
  for (const r of list) {
    const f = (r?.FECHA as string) || ''
    const ymd = f ? f.slice(0, 10) : ''
    if (!ymd) continue
    byDate[ymd] = {
      in: isoTimeToHHMM(r?.HORA_ENTRADA),
      out: isoTimeToHHMM(r?.HORA_SALIDA),
    }
  }

  // Construimos lunes->domingo previo, rellenando vacíos
  const startDate = new Date(start)
  const result: AttendanceDay[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const ymd = toYMD(d)
    const dayName = getDayNameEs(d)
    result.push({
      day: dayName,
      checkIn: byDate[ymd]?.in ?? '',
      checkOut: byDate[ymd]?.out ?? '',
    })
  }

  return result
}

/** ---------- POST MARCAJE (se deja igual) ---------- */
export const postMarcaje = async ({ tipo, fecha }: MarcajeRequest): Promise<void> => {
  const token = localStorage.getItem('TOKENLOG')
  if (!token) throw new Error('Token JWT no disponible')

  const anio = fecha.getFullYear().toString()
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const dia = fecha.getDate().toString().padStart(2, '0')
  const hora = fecha.getHours().toString().padStart(2, '0')
  const minutos = fecha.getMinutes().toString().padStart(2, '0')

  const body = {
    nuevaSolicitud: {
      ANIO: anio,
      MES: mes,
      DIA: dia,
      HORA: hora,
      MINUTOS: minutos,
      LATITUD: 0.0,
      LONGITUD: 0.0,
      ID_DISPOSITIVO: 'HUMANUSS_WEBAPP',
      ENTRADASALIDA: tipo,
    },
  }

  const res = await fetchJson(`/MARCAJE?token=${token}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok && (res as any).error) {
    throw new Error((res as any).error)
  }

  console.log('✅ Marcaje registrado correctamente:', tipo)
}
