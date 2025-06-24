import { create } from 'zustand'
// import type { AttendanceDay } from '@services/attendanceService'
import { getWeeklyAttendance } from '@services/attendanceService'
import type { User } from '@services/authService'

export interface AttendanceRecord {
  day: string // "Lunes", "Martes", etc.
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

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: loadFromStorage(),

  fetchWeek: async (user) => {
    try {
      const data = await getWeeklyAttendance(user)
      const newRecords = {
        ...get().records,
        [user.id]: data,
      }
      set({ records: newRecords })
      saveToStorage(newRecords)
    } catch (error) {
      console.error('Error al cargar asistencia:', error)
    }
  },

  markCheckIn: (userId, day, time) => {
    const current = get().records[userId] || []
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkIn: time } : d
    )

    const exists = current.some((d) => d.day === day)
    const newWeek = exists ? updated : [...current, { day, checkIn: time }]

    const newRecords = {
      ...get().records,
      [userId]: newWeek,
    }

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

    const newRecords = {
      ...get().records,
      [userId]: newWeek,
    }

    set({ records: newRecords })
    saveToStorage(newRecords)
  },

  getWeek: (userId) => {
    return get().records[userId] || []
  },
}))
