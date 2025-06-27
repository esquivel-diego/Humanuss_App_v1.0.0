// src/services/employeeService.ts

import type { User } from './authService'
import { fetchJson } from '@utils/apiClient'

export type Empleado = {
  id: string
  name: string
}

export const getAllEmployees = async (_user?: User): Promise<Empleado[]> => {
  const data = await fetchJson('/EMPLEADO')
  return (data?.recordset ?? []).map((emp: any) => ({
    id: emp.EMPLEADO_ID,
    name: emp.NOMBRE,
  }))
}
