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

/** Card/último pago */
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

/** Tabla/historial */
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

/** ===== Detalle de un periodo específico (para vista y PDF) ===== */
type RawDetail = {
  INGRESO?: string
  MONTO_TOTAL_I?: number
  DESCUENTO?: string
  MONTO_TOTAL_D?: number
  TOTAL_INGRESOS?: number
  TOTAL_DESCUENTOS?: number
  TOTAL_LIQUIDO?: number
  NOMBRE_ESTABLECI?: string
  NOMBRE_USUAL?: string
  DESCRIPCION_PUESTO?: string
  FECHA_INICIAL?: string
  FECHA_FINAL?: string
}

export const getPayrollDetail = async (periodoAAMMNO: string): Promise<{
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  totals: { ingresos: number; descuentos: number; liquido: number }
  header: {
    establecimiento: string
    nombre: string
    puesto: string
    fechaInicial: string | null
    fechaFinal: string | null
  }
}> => {
  const data = await fetchJson(`/v2/SUELDO_DETALLE/${periodoAAMMNO}`)
  const rows: RawDetail[] = data?.recordset ?? []

  const earnings = rows
    .filter(r => (r.INGRESO ?? '').toString().trim().length > 0)
    .map(r => ({
      label: (r.INGRESO ?? '').toString().trim(),
      amount: Number(r.MONTO_TOTAL_I ?? 0),
    }))

  const deductions = rows
    .filter(r => (r.DESCUENTO ?? '').toString().trim().length > 0)
    .map(r => ({
      label: (r.DESCUENTO ?? '').toString().trim(),
      amount: Number(r.MONTO_TOTAL_D ?? 0),
    }))

  const first = rows[0] ?? {}
  const totalIngresos = Number(first.TOTAL_INGRESOS ?? earnings.reduce((s, e) => s + e.amount, 0))
  const totalDescuentos = Number(first.TOTAL_DESCUENTOS ?? deductions.reduce((s, d) => s + d.amount, 0))
  const liquido = Number(
    first.TOTAL_LIQUIDO ??
    Math.max(0, totalIngresos - totalDescuentos)
  )

  // === Ajuste de período: sumar 1 día al rango que viene en el JSON (manejo en UTC para evitar desfases) ===
  const addOneDayUTC = (s?: string) => {
    if (!s) return null
    const d = new Date(s)
    d.setUTCDate(d.getUTCDate() + 1)
    return d.toISOString()
  }

  return {
    earnings,
    deductions,
    totals: {
      ingresos: totalIngresos,
      descuentos: totalDescuentos,
      liquido,
    },
    header: {
      establecimiento: (first.NOMBRE_ESTABLECI ?? '').toString().trim(),
      nombre: (first.NOMBRE_USUAL ?? '').toString().trim(),
      puesto: (first.DESCRIPCION_PUESTO ?? '').toString().trim(),
      fechaInicial: addOneDayUTC(first.FECHA_INICIAL),
      fechaFinal: addOneDayUTC(first.FECHA_FINAL),
    },
  }
}
