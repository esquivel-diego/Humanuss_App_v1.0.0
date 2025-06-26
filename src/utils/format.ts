// src/utils/format.ts

/**
 * Elimina ceros a la izquierda de un ID numérico (por ejemplo, "000000005" → "5").
 * Útil para evitar errores en endpoints reales que no aceptan IDs formateados.
 */
export const sanitizeId = (id: string | number): string => {
  return String(id).replace(/^0+/, '')
}
