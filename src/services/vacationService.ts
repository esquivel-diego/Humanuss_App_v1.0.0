import { fetchJson } from '@utils/apiClient'

export type VacationIndicators = {
  cantidad: number     // Días totales disponibles según el periodo
  diasGozados: number  // Días tomados hasta la fecha
}

/**
 * ✅ Obtiene resumen de vacaciones desde:
 * /INDICADORES?TIPO=SOLICITUDESV=5
 * No requiere parámetros; se extrae todo del token
 */
export const getVacationIndicators = async (): Promise<VacationIndicators> => {
  const data = await fetchJson('/INDICADORES?TIPO=SOLICITUDESV=5')
  const record = data?.recordset?.[0]

  return {
    cantidad: record?.CANTIDAD ?? 0,
    diasGozados: record?.DIAS_GOZADOS ?? 0,
  }
}
