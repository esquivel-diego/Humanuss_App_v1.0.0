const API_BASE = 'https://nominapayone.com/api_demo2/api/portal'
const API_LOGIN = 'https://nominapayone.com/api_demo2/login'
const LOCAL_API = 'http://localhost:4000'

const getToken = () => localStorage.getItem('TOKENLOG')

const refreshToken = async (): Promise<string> => {
  console.warn('🔄 Intentando refrescar token...')

  const email = localStorage.getItem('USER_EMAIL')
  const passwordEncrypted = localStorage.getItem('USER_PASSWORD_ENCRYPTED')

  if (!email || !passwordEncrypted) {
    throw new Error('No hay credenciales almacenadas')
  }

  try {
    const response = await fetch(`${API_LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EMAIL: email, PASSWORD: passwordEncrypted }),
    })

    const result = await response.json()
    const token = result?.token
    const user = result?.recordset?.[0]

    if (!token || !user) throw new Error('Token no disponible')

    localStorage.setItem('TOKENLOG', token)
    localStorage.setItem('authUser', JSON.stringify({ ...user, token }))
    localStorage.setItem('USUARIOLOG', JSON.stringify({ ...user, token }))

    console.log('✅ Token refrescado automáticamente')
    return token
  } catch (err) {
    console.error('❌ Error al refrescar token:', err)
    throw err
  }
}

/**
 * Cliente de requests con manejo de token y diferenciación entre API oficial y local.
 * @param path - Ruta relativa o absoluta
 * @param options - Configuración de request
 * @param retry - Reintentar si token expiró
 */
export const apiClient = async (
  path: string,
  options: RequestInit & { skipToken?: boolean } = {},
  retry = true
): Promise<Response> => {
  const skipToken = options.skipToken === true
  let token = skipToken ? null : getToken()

  if (!skipToken && !token) {
    throw new Error('Token no disponible')
  }

  const isFullUrl = path.startsWith('http')
  const isLocalRequest =
    path.startsWith('/solicitudes') ||
    path.startsWith('/notificaciones') ||
    path.startsWith('/marcajes')

  const endpoint = isFullUrl
    ? path
    : isLocalRequest
    ? `${LOCAL_API}${path}`
    : `${API_BASE}${path}`

  const hasToken = skipToken || endpoint.includes('token=')
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = !skipToken && !hasToken ? `${endpoint}${separator}token=${token}` : endpoint

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  console.log('🌐 Request:', url)

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401 && !skipToken && retry) {
    try {
      await refreshToken()
      return apiClient(path, { ...options, skipToken }, false)
    } catch (err) {
      console.error('❌ No se pudo refrescar token:', err)
      throw err
    }
  }

  return response
}

export const fetchJson = async <T = any>(
  path: string,
  options: RequestInit & { skipToken?: boolean } = {}
): Promise<T> => {
  const res = await apiClient(path, options)

  const contentType = res.headers.get('content-type') ?? ''
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text()
    console.error('❌ Respuesta inesperada del servidor:', text)
    throw new Error('Respuesta no válida del servidor')
  }

  return res.json()
}
