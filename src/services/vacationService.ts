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

// ✅ Corregido: obtener PERIODO a partir del endpoint correcto
export const getVacationPeriod = async (): Promise<string> => {
  const data = await fetchJson('/INDICADORES?TIPO=SOLICITUDESV=5')
  const record = data?.recordset?.[0]
  const baseYear = parseInt(record?.PERIODO_AA)

  if (!baseYear || isNaN(baseYear)) return 'N/A'
  return `${baseYear}-${baseYear + 1}`
}
