// src/services/newsService.ts
export type NewsItem = {
  id: number
  title: string
  content: string
  date: string
}

const API_URL = import.meta.env.VITE_API_URL

/**
 * Obtener todas las noticias publicadas
 */
export const fetchNews = async (): Promise<NewsItem[]> => {
  const res = await fetch(`${API_URL}/noticias`)
  if (!res.ok) throw new Error('Error al obtener noticias')
  const data = await res.json()
  return data?.recordset || []
}

/**
 * Crear una nueva noticia
 */
export const createNews = async (title: string, content: string): Promise<NewsItem> => {
  const res = await fetch(`${API_URL}/noticias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      noticia: {
        TITULO: title,
        CONTENIDO: content
      }
    })
  })

  if (!res.ok) throw new Error('Error al crear noticia')
  const data = await res.json()
  const created = data?.recordset?.[0]
  return {
    id: created?.NOTICIA_ID,
    title: created?.TITULO,
    content: created?.CONTENIDO,
    date: created?.FECHA_CREACION
  }
}

// src/services/newsService.ts

export type Empleado = {
  id: string
  name: string
}

export const getAllEmployees = async (): Promise<Empleado[]> => {
  const API_URL = import.meta.env.VITE_API_URL
  const res = await fetch(`${API_URL}/empleado`)

  if (!res.ok) {
    throw new Error('Error al obtener empleados')
  }

  const data = await res.json()
  const raw = data?.recordset || []

  return raw.map((emp: any) => ({
    id: emp.ID,
    name: emp.NOMBRE
  }))
}
