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
  addNotification: (notif: Omit<Notification, 'id'>) => void
  markAsRead: (id: number) => void
  markAllAsRead: (userId: number) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: state.notifications.length + 1,
          ...notif
        }
      ]
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    })),

  markAllAsRead: (userId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      )
    }))
}))
