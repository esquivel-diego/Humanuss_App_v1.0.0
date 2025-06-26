// src/services/indicatorService.ts
import { fetchJson } from '@utils/apiClient'
import { sanitizeId } from '@utils/format'
import type { User } from './authService'

export type VacationIndicator = {
  cantidad: number
  diasGozados: number
  diasPagados: number
  leyenda: string
}

export const getVacationIndicators = async (user: User): Promise<VacationIndicator | null> => {
  const cleanedId = sanitizeId(user.id)
  const data = await fetchJson(`/indicadores?TIPO=VACACION&EMPLEADO_ID=${cleanedId}`)
  const record = data?.recordset?.[0]

  if (!record) return null

  return {
    cantidad: record.CANTIDAD ?? 0,
    diasGozados: record.DIAS_GOZADOS ?? 0,
    diasPagados: record.DIAS_PAGADOS ?? 0,
    leyenda: record.LEYENDA ?? 'N/A',
  }
}
