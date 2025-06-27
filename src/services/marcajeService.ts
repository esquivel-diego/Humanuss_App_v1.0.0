// src/services/marcajeService.ts
import { fetchJson } from "@utils/apiClient"

export interface MarcajeRequest {
  empleadoId: string
  fecha: string // formato: yyyy-mm-dd
  hora: string  // formato: HH:mm
  tipo: "E" | "S" // E = entrada, S = salida
}

/**
 * Envía un marcaje (entrada o salida) al backend propio local.
 */
export const postMarcajeLocal = async (data: MarcajeRequest): Promise<void> => {
  try {
    await fetchJson("http://localhost:4000/marcajes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("❌ Error al guardar marcaje local:", error)
    throw new Error("No se pudo registrar el marcaje local")
  }
}
