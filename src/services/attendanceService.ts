// src/services/attendanceService.ts

import type { User } from './authService'
import { fetchJson } from '@utils/apiClient'

export type AttendanceDay = {
  day: string
  checkIn: string
  checkOut: string
}

// ✅ Obtiene la asistencia semanal del usuario autenticado
export const getWeeklyAttendance = async (user: User): Promise<AttendanceDay[]> => {
  const query = `/indicadores?TIPO=MARCAJE&EMPLEADO_ID=${encodeURIComponent(user.id)}`
  const data = await fetchJson(query)
  const raw = data?.recordset ?? []

  return raw.map((entry: any) => ({
    day: entry.DIA ?? '',
    checkIn: entry.CHECKIN ?? '',
    checkOut: entry.CHECKOUT ?? '',
  }))
}
