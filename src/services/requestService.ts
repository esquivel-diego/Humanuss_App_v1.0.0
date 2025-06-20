// src/services/requestService.ts

export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada'

export type Request = {
  id: number
  userId: number
  name?: string
  type: string
  date: string
  range?: string
  notes?: string
  status: RequestStatus
}

const STORAGE_KEY = 'hr_requests'

/**
 * Inicializa localStorage si está vacío (solo la primera vez)
 */
const initializeMockData = () => {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    const mock: Request[] = [
      {
        id: 1,
        userId: 2, // admin
        type: 'Vacaciones',
        date: '2025-06-20',
        status: 'pendiente',
      },
      {
        id: 2,
        userId: 1, // Juan Pérez
        type: 'Constancia laboral',
        date: '2025-06-18',
        status: 'pendiente',
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mock))
  }
}

/**
 * Obtiene todas las solicitudes desde "la API"
 */
export const getAllRequests = (): Request[] => {
  initializeMockData()
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

/**
 * Agrega una nueva solicitud
 */
export const createRequest = (newRequest: Omit<Request, 'id'>): void => {
  const existing = getAllRequests()
  const nextId = existing.length > 0 ? Math.max(...existing.map(r => r.id)) + 1 : 1
  const updated = [...existing, { ...newRequest, id: nextId }]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

/**
 * Actualiza el estado de una solicitud
 */
export const updateRequestStatus = (
  id: number,
  newStatus: RequestStatus
): Request[] => {
  const requests = getAllRequests()
  const updated = requests.map((req) =>
    req.id === id ? { ...req, status: newStatus } : req
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
