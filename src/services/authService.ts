// src/services/authService.ts

export type User = {
  id: string // EMPLEADO_ID
  name: string // NOMBRE
  username: string // USER_ID
  role: 'admin' | 'employee' // PERFIL_ID
  token: string
}

const API_URL = import.meta.env.VITE_API_URL

export const login = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: {
        USER_ID: username,
        PASSWORD: password
      }
    })
  })

  if (!response.ok) {
    throw new Error('Credenciales inválidas')
  }

  const data = await response.json()
  const record = data?.recordset?.[0]

  if (!record || !data.token) {
    throw new Error('Respuesta incompleta del servidor')
  }

  return {
    id: record.EMPLEADO_ID,
    name: record.NOMBRE,
    username: record.USER_ID,
    role: record.PERFIL_ID === 1 || record.PERFIL_ID === 'admin' ? 'admin' : 'employee',
    token: data.token
  }
}
