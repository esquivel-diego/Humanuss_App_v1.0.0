// src/services/attendanceService.ts

import type { User } from './authService'
import { fetchJson } from '@utils/apiClient'
import { sanitizeId } from '@utils/format'

export type AttendanceDay = {
  day: string
  checkIn: string
  checkOut: string
}

// ✅ Asistencia semanal con parámetros válidos
export const getWeeklyAttendance = async (user: User): Promise<AttendanceDay[]> => {
  const cleanedId = sanitizeId(user.id)
  const url = `/indicadores?TIPO=MARCAJE&EMPLEADO_ID=${cleanedId}`
  const data = await fetchJson(url)
  const raw = data?.recordset ?? []

  return raw.map((entry: any) => ({
    day: entry.DIA ?? '',
    checkIn: entry.CHECKIN ?? '',
    checkOut: entry.CHECKOUT ?? '',
  }))
}
