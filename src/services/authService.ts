// src/services/authService.ts
import CryptoJS from 'crypto-js'

export type User = {
  id: string
  name: string
  username: string
  role: 'admin' | 'employee'
  token: string
  position?: string
  photoUrl?: string
}

const BASE_URL = 'https://nominapayone.com/api_demo2/login'

export const login = async (email: string, password: string): Promise<User> => {
  // Paso 1: Obtener clave AES dinámica
  const keyRes = await fetch(`${BASE_URL}/OBTENER`)
  const keyData = await keyRes.json()
  const llave = keyData?.Data
  if (!llave) throw new Error('No se pudo obtener la clave de cifrado')

  // Paso 2: Cifrar contraseña
  const encryptedPassword = CryptoJS.AES.encrypt(password, llave).toString()

  // Paso 3: Enviar credenciales
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ EMAIL: email, PASSWORD: encryptedPassword }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Login error:', errorText)
    throw new Error('Credenciales inválidas o error de servidor')
  }

  const data = await response.json()
  const record = data?.recordset?.[0]
  const token = data?.token
  if (!record || !token) throw new Error('Respuesta incompleta del servidor')

  // Paso 4: Guardar el token para futuras peticiones
  localStorage.setItem('TOKENLOG', token)

  // Paso 5: Obtener imagen (opcional)
  let photoUrl = ''
  try {
    const imgRes = await fetch(`https://nominapayone.com/api_demo2/empleado/IMAGEN?token=${token}`)
    const contentType = imgRes.headers.get('content-type') || ''
    const rawText = await imgRes.text()

    if (imgRes.ok && contentType.includes('application/json')) {
      const json = JSON.parse(rawText)
      if (json?.Data) {
        photoUrl = `data:image/jpeg;base64,${json.Data}`
      }
    } else {
      console.warn('⚠️ Imagen no válida o inesperada:', rawText)
    }
  } catch (err) {
    console.warn('⚠️ No se pudo obtener imagen del usuario:', err)
  }

  // Paso 6: Armar objeto de usuario
  const user: User = {
    id: record.EMPLEADO_ID,
    name: record.NOMBRE,
    username: record.USER_ID ?? email,
    role: record.PERFIL_ID === 1 ? 'admin' : 'employee',
    token,
    position: record.PUESTO ?? '',
    photoUrl,
  }

  // Paso 7: Guardar usuario en localStorage
  localStorage.setItem('authUser', JSON.stringify(user))
  localStorage.setItem('USUARIOLOG', JSON.stringify(user))
  localStorage.setItem('USER_EMAIL', email)
  localStorage.setItem('USER_PASSWORD_ENCRYPTED', encryptedPassword)

  return user
}
