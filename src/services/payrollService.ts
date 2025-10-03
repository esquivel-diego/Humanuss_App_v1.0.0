import { fetchJson } from '@utils/apiClient'

export type PayrollPayment = {
  amount: number
  date: string
  periodo?: string       // PERIODO_AAMM (YYYY-MM)
  tipo?: string          // GRUPO_PAGO_DESC
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  downloadUrl?: string
  diasGozados?: number
  diasPagados?: number
}

type RawSueldoItem = {
  PERIODO_AAMMNO?: string
  PERIODO_AAMM?: string
  MONTO?: number
  DESCRIPCION?: string
  GRUPO_PAGO_DESC?: string
  CODIGO_TOT?: string
  BOLETA?: string
  URL_BOLETA?: string
}

function pickLatestByPeriodo(items: RawSueldoItem[]): RawSueldoItem | undefined {
  return [...items]
    .sort((a, b) => (b.PERIODO_AAMMNO ?? '').localeCompare(a.PERIODO_AAMMNO ?? ''))[0]
}

/**
 * ✅ Último pago:
 * Consulta v2/INDICADORES/SUELDOS (12 registros) y toma el más reciente por PERIODO_AAMMNO.
 * Preferimos la fila total (CODIGO_TOT === 'TT3'); si no existe, tomamos la más reciente de cualquier tipo.
 * IMPORTANTE: con fetchJson pasamos SOLO "/v2/..." porque el cliente ya antepone "/api/portal".
 */
export const getLastPayroll = async (): Promise<PayrollPayment | null> => {
  const data = await fetchJson('/v2/INDICADORES/SUELDOS?NUMERO_REGISTROS=12')
  const records: RawSueldoItem[] = data?.recordset ?? []
  if (records.length === 0) return null

  const totals = records.filter(r => r.CODIGO_TOT === 'TT3')
  const latest = totals.length ? pickLatestByPeriodo(totals) : pickLatestByPeriodo(records)
  if (!latest) return null

  return {
    amount: Number(latest.MONTO ?? 0),
    date: latest.PERIODO_AAMMNO ?? new Date().toISOString(),
    periodo: latest.PERIODO_AAMM ?? '',
    tipo: latest.GRUPO_PAGO_DESC ?? '',
    earnings: [],
    deductions: [],
    downloadUrl: latest.URL_BOLETA,
  }
}

/**
 * ✅ Historial por periodo:
 * Agrupa por PERIODO_AAMMNO. Para el monto total del periodo usamos TT3 si existe;
 * si no, calculamos la suma de ingresos (I) como fallback.
 */
export const getPayrollForUser = async (): Promise<PayrollPayment[]> => {
  const data = await fetchJson('/v2/INDICADORES/SUELDOS?NUMERO_REGISTROS=12')
  const records: RawSueldoItem[] = data?.recordset ?? []

  const grouped = records.reduce((acc: Record<string, RawSueldoItem[]>, item) => {
    const key = item.PERIODO_AAMMNO ?? 'SIN_FECHA'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return Object.entries(grouped).map(([date, items]) => {
    const totalRow = items.find(r => r.CODIGO_TOT === 'TT3')
    const ingresos = items.filter(r => r.CODIGO_TOT === 'I')
    const deducciones = items.filter(r => r.CODIGO_TOT === 'D')

    const amount = totalRow
      ? Number(totalRow.MONTO ?? 0)
      : ingresos.reduce((sum, r) => sum + Number(r.MONTO ?? 0), 0)

    return {
      amount,
      date,
      earnings: ingresos.map(r => ({
        label: r.DESCRIPCION ?? '',
        amount: Number(r.MONTO ?? 0),
      })),
      deductions: deducciones.map(r => ({
        label: r.DESCRIPCION ?? '',
        amount: Number(r.MONTO ?? 0),
      })),
      downloadUrl: totalRow?.URL_BOLETA ?? items[0]?.URL_BOLETA,
    }
  })
}

/**
 * ✅ Detalle de un periodo específico:
 * Endpoint v2: /v2/SUELDO_DETALLE/:PERIODO_AAMMNO
 */
export const getPayrollDetail = async (periodoAAMMNO: string) => {
  const data = await fetchJson(`/v2/SUELDO_DETALLE/${periodoAAMMNO}`)
  const records: RawSueldoItem[] = data?.recordset ?? []

  const earnings = records
    .filter(r => r.CODIGO_TOT === 'I')
    .map(r => ({
      label: r.DESCRIPCION ?? '',
      amount: Number(r.MONTO ?? 0),
    }))

  const deductions = records
    .filter(r => r.CODIGO_TOT === 'D')
    .map(r => ({
      label: r.DESCRIPCION ?? '',
      amount: Number(r.MONTO ?? 0),
    }))

  return { earnings, deductions }
}
