import { fetchJson } from '@utils/apiClient'

export type VacationIndicators = {
  cantidad: number
  diasGozados: number
}

export const getVacationIndicators = async (): Promise<VacationIndicators> => {
  const data = await fetchJson('/INDICADORES?TIPO=SOLICITUDESV=5')
  const record = data?.recordset?.[0]

  return {
    cantidad: record?.CANTIDAD ?? 0,
    diasGozados: record?.DIAS_GOZADOS ?? 0,
  }
}
