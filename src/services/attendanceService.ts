// src/services/attendanceService.ts

import { fetchJson } from '@utils/apiClient'

export type AttendanceDay = {
  day: string
  checkIn: string
  checkOut: string
}

// ✅ Asistencia semanal desde /MARCAJE
export const getWeeklyAttendance = async (): Promise<AttendanceDay[]> => {
  const url = '//INDICADORES?TIPO=MARCAJE'
  const data = await fetchJson(url)
  const raw = data?.recordset ?? []

  return raw.map((entry: any) => ({
    day: entry.DIA ?? '',
    checkIn: entry.CHECKIN ?? '',
    checkOut: entry.CHECKOUT ?? '',
  }))
}
