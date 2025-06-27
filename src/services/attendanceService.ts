// src/services/attendanceService.ts

import { fetchJson } from '@utils/apiClient'

export type AttendanceDay = {
  day: string
  checkIn: string
  checkOut: string
}

export type MarcajeTipo = 'E' | 'S'

export interface MarcajeRequest {
  tipo: MarcajeTipo // 'E' para entrada, 'S' para salida
  fecha: Date       // fecha y hora completa del momento del marcaje
}

// 🧠 Utilidades para obtener día formateado
const formatDate = (date: Date): string =>
  date.toISOString().split('T')[0]

const getDayName = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long' })
    .format(date)
    .replace(/^\w/, (c) => c.toUpperCase())

// ✅ Obtiene asistencia de los últimos 7 días (completa)
export const getWeeklyAttendance = async (): Promise<AttendanceDay[]> => {
  const userRaw = localStorage.getItem('authUser')
  const token = localStorage.getItem('TOKENLOG')

  if (!userRaw || !token) {
    console.warn('⚠️ Usuario o token no disponibles')
    return []
  }

  const user = JSON.parse(userRaw)
  const empleadoId = user?.id

  if (!empleadoId) {
    console.warn('⚠️ ID de empleado no válido')
    return []
  }

  const today = new Date()
  const results: AttendanceDay[] = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const formattedDate = formatDate(date)
    const dayName = getDayName(date)

    try {
      const response = await fetchJson(`/MARCAJE/${formattedDate}`)
      const record = response?.recordset?.[0] ?? {}

      results.unshift({
        day: dayName,
        checkIn: record?.CHECKIN ?? '',
        checkOut: record?.CHECKOUT ?? '',
      })
    } catch (err) {
      results.unshift({
        day: dayName,
        checkIn: '',
        checkOut: '',
      })
    }
  }

  return results
}

// ✅ POST para registrar un marcaje (check-in o check-out)
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

  if (!res.ok && res.error) {
    throw new Error(res.error)
  }

  console.log('✅ Marcaje registrado correctamente:', tipo)
}
