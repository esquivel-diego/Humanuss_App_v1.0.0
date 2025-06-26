// src/services/newsService.ts
import { getStoredToken } from '@utils/token'

export type NewsItem = {
  id: number
  title: string
  content: string
  date: string
}

export type Empleado = {
  id: string
  name: string
}

const API_URL = 'https://nominapayone.com/api_demo2'

/**
 * Obtener todas las noticias publicadas (requiere token)
 */
export const fetchNews = async (): Promise<NewsItem[]> => {
  const token = getStoredToken()

  const res = await fetch(`${API_URL}/noticias`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Error al obtener noticias:', text)
    throw new Error('No se pudieron cargar las noticias')
  }

  const data = await res.json()
  return data?.recordset ?? []
}

/**
 * Crear una nueva noticia (requiere token)
 */
export const createNews = async (title: string, content: string): Promise<NewsItem> => {
  const token = getStoredToken()

  const res = await fetch(`${API_URL}/noticias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      noticia: {
        TITULO: title,
        CONTENIDO: content
      }
    })
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Error al crear noticia:', text)
    throw new Error('No se pudo crear la noticia')
  }

  const data = await res.json()
  const created = data?.recordset?.[0]

  return {
    id: created?.NOTICIA_ID,
    title: created?.TITULO,
    content: created?.CONTENIDO,
    date: created?.FECHA_CREACION
  }
}

/**
 * Obtener todos los empleados (requiere token)
 */
export const getAllEmployees = async (): Promise<Empleado[]> => {
  const token = getStoredToken()

  const res = await fetch(`${API_URL}/empleado`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Error al obtener empleados:', text)
    throw new Error('No se pudieron cargar los empleados')
  }

  const data = await res.json()
  const raw = data?.recordset ?? []

  return raw.map((emp: any) => ({
    id: emp.EMPLEADO_ID ?? emp.ID,
    name: emp.NOMBRE
  }))
}