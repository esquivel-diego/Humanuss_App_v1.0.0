export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada'

export type Request = {
  id: number
  userId: string
  name?: string
  type: 'Vacación' | 'Permiso'
  date: string
  range: string
  notes?: string
  status: RequestStatus
}
