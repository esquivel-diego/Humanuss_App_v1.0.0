import type { User } from './authService'

export type AttendanceDay = {
  day: string
  checkIn: string
  checkOut: string
}

export const getWeeklyAttendance = async (
  user: User
): Promise<AttendanceDay[]> => {
  const API_URL = import.meta.env.VITE_API_URL

  const res = await fetch(`${API_URL}/marcaje/${user.id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Error al obtener asistencia semanal')
  }

  const data = await res.json()
  const raw = data?.recordset ?? []

  return raw.map((entry: any) => ({
    day: entry.DIA,
    checkIn: entry.CHECKIN,
    checkOut: entry.CHECKOUT,
  }))
}
