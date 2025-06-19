import { create } from 'zustand'
import { getAllRequests, updateRequestStatus, type Request, type RequestStatus } from '@services/requestService'

type RequestStore = {
  requests: Request[]
  fetchRequests: () => void
  updateStatus: (id: number, newStatus: RequestStatus) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],

  fetchRequests: () => {
    const data = getAllRequests()
    set({ requests: data })
  },

  updateStatus: (id, newStatus) => {
    const updated = updateRequestStatus(id, newStatus)
    set({ requests: updated })
  }
}))

