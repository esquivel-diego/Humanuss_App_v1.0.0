import { create } from 'zustand'
import type { User } from '@services/authService'
import { getAllRequests } from '@services/requestService'
import type { Request, RequestStatus } from '@services/requestService'

type RequestStore = {
  requests: Request[]
  fetchRequests: (user: User) => Promise<void>
  updateRequestStatus: (id: number, newStatus: RequestStatus) => void
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],

  fetchRequests: async (user) => {
    try {
      const data = await getAllRequests(user)
      set({ requests: data })
    } catch (error) {
      console.error('Error al obtener solicitudes:', error)
    }
  },

  updateRequestStatus: (id, newStatus) => {
    const updated = get().requests.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    )
    set({ requests: updated })
  }
}))

