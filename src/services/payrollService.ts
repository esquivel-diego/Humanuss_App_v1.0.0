// src/services/payrollService.ts

import { fetchJson } from '@utils/apiClient'

export type PayrollPayment = {
  amount: number
  date: string
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  downloadUrl?: string
  diasGozados?: number
  diasPagados?: number
}

type RawSueldoItem = {
  PERIODO_AAMMNO?: string
  MONTO?: number
  DESCRIPCION?: string
  CODIGO_TOT?: 'I' | 'D'
  BOLETA?: string
  URL_BOLETA?: string
}

// ✅ Último pago
export const getLastPayroll = async (): Promise<PayrollPayment | null> => {
  const data = await fetchJson('/INDICADORES/SUELDOS')
  const records: RawSueldoItem[] = data?.recordset ?? []

  if (records.length === 0) return null

  const ingresos = records.filter(r => r.CODIGO_TOT === 'I')
  const deducciones = records.filter(r => r.CODIGO_TOT === 'D')
  const total = ingresos.reduce((sum, r) => sum + (r.MONTO ?? 0), 0)
  const latest = records[0]

  return {
    amount: total,
    date: latest.PERIODO_AAMMNO ?? new Date().toISOString(),
    earnings: ingresos.map(r => ({
      label: r.DESCRIPCION ?? '',
      amount: r.MONTO ?? 0,
    })),
    deductions: deducciones.map(r => ({
      label: r.DESCRIPCION ?? '',
      amount: r.MONTO ?? 0,
    })),
    downloadUrl: latest.URL_BOLETA,
  }
}

// ✅ Historial
export const getPayrollForUser = async (): Promise<PayrollPayment[]> => {
  const data = await fetchJson('/INDICADORES/SUELDOS')
  const records: RawSueldoItem[] = data?.recordset ?? []

  const grouped = records.reduce((acc: Record<string, RawSueldoItem[]>, item) => {
    const key = item.PERIODO_AAMMNO ?? 'SIN_FECHA'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return Object.entries(grouped).map(([date, items]) => {
    const ingresos = items.filter(r => r.CODIGO_TOT === 'I')
    const deducciones = items.filter(r => r.CODIGO_TOT === 'D')
    const total = ingresos.reduce((sum, r) => sum + (r.MONTO ?? 0), 0)

    return {
      amount: total,
      date,
      earnings: ingresos.map(r => ({
        label: r.DESCRIPCION ?? '',
        amount: r.MONTO ?? 0,
      })),
      deductions: deducciones.map(r => ({
        label: r.DESCRIPCION ?? '',
        amount: r.MONTO ?? 0,
      })),
      downloadUrl: items[0].URL_BOLETA,
    }
  })
}

// ✅ Detalle por período
export const getPayrollDetail = async (periodo: string) => {
  const data = await fetchJson(`/INDICADORES/SUELDO_DETALLE/${periodo}`)
  const records: RawSueldoItem[] = data?.recordset ?? []

  const earnings = records.filter(r => r.CODIGO_TOT === 'I').map(r => ({
    label: r.DESCRIPCION ?? '',
    amount: r.MONTO ?? 0,
  }))

  const deductions = records.filter(r => r.CODIGO_TOT === 'D').map(r => ({
    label: r.DESCRIPCION ?? '',
    amount: r.MONTO ?? 0,
  }))

  return { earnings, deductions }
}
