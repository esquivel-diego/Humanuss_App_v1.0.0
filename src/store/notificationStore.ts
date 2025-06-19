// src/store/notificationStore.ts
import { create } from 'zustand'

export type Notification = {
  id: number
  userId: number
  message: string
  date: string
  read: boolean
}

type NotificationStore = {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id'>) => void
  markAsRead: (id: number) => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'notifications'

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (n) => {
    const existing = get().notifications
    const newNotification = { ...n, id: Date.now() }
    const updated = [...existing, newNotification]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ notifications: updated })
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ notifications: updated })
  },

  loadFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      set({ notifications: JSON.parse(raw) })
    }
  }
}))
