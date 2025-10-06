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

// Semana ACTUAL de lunes (1) a domingo (0), horario local
const getCurrentWeekRangeMondayStart = (today = new Date()): { start: string; end: string } => {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate()) // 00:00 local
  const diffToMonday = (d.getDay() + 6) % 7 // 0 si es lunes, 6 si es domingo
  const monday = new Date(d)
  monday.setDate(d.getDate() - diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return { start: toYMD(monday), end: toYMD(sunday) }
}

const getDayNameEs = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long' })
    .format(date)
    .replace(/^\w/u, (c) => c.toUpperCase())

// ISO → HH:MM en HORA LOCAL
const isoToLocalHHMM = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

/** ---------- API v2: asistencia por rango (semana actual Lun→Dom) ---------- */
export const getWeeklyAttendance = async (): Promise<AttendanceDay[]> => {
  const { start, end } = getCurrentWeekRangeMondayStart()

  // Pedimos la asistencia de la SEMANA ACTUAL (lunes a domingo)
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
      in: isoToLocalHHMM(r?.HORA_ENTRADA), // hora LOCAL
      out: isoToLocalHHMM(r?.HORA_SALIDA), // hora LOCAL
    }
  }

  // Construimos lunes->domingo actual, rellenando vacíos
  const startDate = new Date(start)
  const result: AttendanceDay[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const ymd = toYMD(d)
    const dayName = getDayNameEs(d) // "Lunes", "Martes", ...
    result.push({
      day: dayName,
      checkIn: byDate[ymd]?.in ?? '',
      checkOut: byDate[ymd]?.out ?? '',
    })
  }

  return result
}

/** ---------- POST MARCAJE (legacy; no usado en v2 directo) ---------- */
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
