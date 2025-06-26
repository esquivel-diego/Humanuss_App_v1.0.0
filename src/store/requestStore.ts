// src/store/requestStore.ts
import { create } from 'zustand'
import { getAllRequests, updateRequestStatus } from '@services/requestService'
import type { Request, RequestStatus } from '@services/requestService'
import { useAuthStore } from './authStore'

type RequestStore = {
  requests: Request[]
  fetchRequests: () => Promise<void>
  updateStatus: (id: number, newStatus: RequestStatus) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],

  fetchRequests: async () => {
    try {
      const { user } = useAuthStore.getState()
      if (!user) return

      const data = await getAllRequests() // ✅
      set({ requests: data })
    } catch (error) {
      console.error('Error al obtener solicitudes:', error)
    }
  },

  updateStatus: (id, newStatus) => {
    // ⚠️ Esto sigue siendo mock, ya que no hay endpoint real
    const updated = updateRequestStatus(id, newStatus)
    set({ requests: updated })
  }
}))
