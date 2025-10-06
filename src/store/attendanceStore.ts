// src/store/attendanceStore.ts
import { create } from 'zustand'
import { getWeeklyAttendance } from '@services/attendanceService'
import type { User } from '@services/authService'

export interface AttendanceRecord {
  day: string // "Domingo", "Lunes", etc.
  checkIn?: string
  checkOut?: string
}

interface AttendanceStore {
  records: Record<string, AttendanceRecord[]>
  fetchWeek: (user: User) => Promise<void>
  markCheckIn: (userId: string, day: string, time: string) => void
  markCheckOut: (userId: string, day: string, time: string) => void
  getWeek: (userId: string) => AttendanceRecord[]
}

const STORAGE_KEY = 'attendanceStore'

const loadFromStorage = (): Record<string, AttendanceRecord[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const saveToStorage = (records: Record<string, AttendanceRecord[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // no-op
  }
}

const getDayNameEs = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long' })
    .format(date)
    .replace(/^\w/u, (c) => c.toUpperCase())

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: loadFromStorage(),

  fetchWeek: async (user) => {
    if (!user || !user.id) {
      console.warn('⚠️ Usuario inválido en fetchWeek')
      return
    }

    try {
      // Datos de la SEMANA ACTUAL (Dom→Sáb) desde API v2
      const apiWeek = await getWeeklyAttendance()

      // Solo preservamos el marcaje LOCAL de HOY (si existe) para no perder la inmediatez
      const localWeek = get().records[user.id] || []
      const todayName = getDayNameEs(new Date())
      const localToday = localWeek.find(d => d.day === todayName)

      const merged = apiWeek.map(apiDay => {
        if (apiDay.day !== todayName || !localToday) return apiDay
        // si hoy tiene marcaje local, priorizarlo sobre el valor de API
        return {
          day: apiDay.day,
          checkIn: localToday.checkIn ?? apiDay.checkIn,
          checkOut: localToday.checkOut ?? apiDay.checkOut,
        }
      })

      const newRecords = {
        ...get().records,
        [user.id]: merged, // ⬅️ Reemplazamos la semana. NO arrastramos datos de otras semanas.
      }

      set({ records: newRecords })
      saveToStorage(newRecords)
    } catch (error) {
      console.error('❌ Error al cargar asistencia semanal:', error)
    }
  },

  markCheckIn: (userId, day, time) => {
    const current = get().records[userId] || []
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkIn: time } : d
    )
    const exists = current.some((d) => d.day === day)
    const newWeek = exists ? updated : [...current, { day, checkIn: time }]

    const newRecords = { ...get().records, [userId]: newWeek }
    set({ records: newRecords })
    saveToStorage(newRecords)
  },

  markCheckOut: (userId, day, time) => {
    const current = get().records[userId] || []
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkOut: time } : d
    )
    const exists = current.some((d) => d.day === day)
    const newWeek = exists ? updated : [...current, { day, checkOut: time }]

    const newRecords = { ...get().records, [userId]: newWeek }
    set({ records: newRecords })
    saveToStorage(newRecords)
  },

  getWeek: (userId) => {
    return get().records[userId] || []
  },
}))
