// src/services/employeeService.ts

import type { User } from './authService'
import { getStoredToken } from '@utils/token'

export type Empleado = {
  id: string
  name: string
}

const API_URL = 'https://nominapayone.com/api_demo2/api/portal'

export const getAllEmployees = async (_user?: User): Promise<Empleado[]> => {
  const res = await fetch(`${API_URL}/EMPLEADO`, {
    headers: {
      Authorization: `Bearer ${getStoredToken()}`,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Error al obtener empleados:', errorText)
    throw new Error('Error al obtener empleados')
  }

  const data = await res.json()

  return (data?.recordset ?? []).map((emp: any) => ({
    id: emp.EMPLEADO_ID,
    name: emp.NOMBRE,
  }))
}
