// src/utils/apiClient.ts

const API_BASE = 'https://nominapayone.com/api_demo2/api/movil' // 👈 CORREGIDO

export const apiClient = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('TOKENLOG')
  if (!token) {
    console.error('❌ No hay token disponible en localStorage')
    throw new Error('Token JWT no disponible')
  }

  const isFullUrl = path.startsWith('http')
  const endpoint = isFullUrl ? path : `${API_BASE}${path}`

  const hasToken = endpoint.includes('token=')
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = hasToken ? endpoint : `${endpoint}${separator}token=${token}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  console.log('🌐 Request:', url)

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}

export const fetchJson = async <T = any>(
  path: string,
  options: RequestInit = {}
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
