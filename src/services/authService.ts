// src/services/authService.ts
import CryptoJS from 'crypto-js'

export type User = {
  id: string // EMPLEADO_ID
  name: string // NOMBRE
  username: string // EMAIL o USER_ID
  role: 'admin' | 'employee' // PERFIL_ID
  token: string
}

// URL base del backend oficial
const BASE_URL = 'https://nominapayone.com/api_demo2/login'

export const login = async (email: string, password: string): Promise<User> => {
  // Paso 1: Obtener la clave de cifrado
  const keyRes = await fetch(`${BASE_URL}/OBTENER`)
  const keyData = await keyRes.json()
  const llave = keyData?.Data

  if (!llave) throw new Error('No se pudo obtener la clave de cifrado')

  // Paso 2: Encriptar el password usando AES
  const encryptedPassword = CryptoJS.AES.encrypt(password, llave).toString()

  // Paso 3: Realizar el login
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      EMAIL: email,
      PASSWORD: encryptedPassword,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Login error:', errorText)
    throw new Error('Credenciales inválidas o error de servidor')
  }

  const data = await response.json()
  const record = data?.recordset?.[0]
  const token = data?.token

  if (!record || !token) {
    throw new Error('Respuesta incompleta del servidor')
  }

  return {
    id: record.EMPLEADO_ID,
    name: record.NOMBRE,
    username: record.USER_ID ?? email,
    role: record.PERFIL_ID === 1 ? 'admin' : 'employee',
    token,
  }
}
