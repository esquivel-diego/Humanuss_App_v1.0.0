import { fetchJson } from '@utils/apiClient'

export type Empleado = {
  id: string
  name: string
}

export const getAllEmployees = async (): Promise<Empleado[]> => {
  const res = await fetchJson('/empleados', {
    skipToken: true,
    forceLocal: true
  })

  return res.recordset ?? []
}
