// src/services/employeeService.ts

export type Empleado = {
  id: string
  name: string
}

const API_URL = import.meta.env.VITE_API_URL

/**
 * Obtener todos los empleados
 */
export const getAllEmployees = async (): Promise<Empleado[]> => {
  const res = await fetch(`${API_URL}/empleado`)
  if (!res.ok) throw new Error('Error al obtener empleados')
  const data = await res.json()

  return (data?.recordset ?? []).map((emp: any) => ({
    id: emp.EMPLEADO_ID,
    name: emp.NOMBRE
  }))
}
