import { create } from 'zustand'
import rawRequests from '@mocks/requests.json'

export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada'

export type Request = {
  id: number
  employee: string
  userId: number
  type: string
  date: string
  status: RequestStatus
}

type RequestStore = {
  requests: Request[]
  updateStatus: (id: number, newStatus: RequestStatus) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: rawRequests as Request[],

  updateStatus: (id, newStatus) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      )
    }))
}))
