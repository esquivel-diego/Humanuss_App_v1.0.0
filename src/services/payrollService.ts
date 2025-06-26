// src/services/payrollService.ts

import type { User } from './authService'
import { fetchJson } from '@utils/apiClient'
import { sanitizeId } from '@utils/format'

export type PayrollPayment = {
  amount: number
  date: string
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  downloadUrl?: string
  diasGozados?: number
  diasPagados?: number
}

// ✅ Último pago del usuario
export const getLastPayroll = async (user: User): Promise<PayrollPayment | null> => {
  const cleanedId = sanitizeId(user.id)
  const data = await fetchJson(`/indicadores?TIPO=SUELDO&EMPLEADO_ID=${cleanedId}`)
  const record = data?.recordset?.[0]
  if (!record || !record.SUELDO) return null

  return {
    amount: record.SUELDO,
    date: record.FECHA_PAGO ?? new Date().toISOString(),
    earnings: [{ label: 'Sueldo base', amount: record.SUELDO }],
    deductions: [
      { label: 'IGSS', amount: record.IGSS ?? 0 },
      { label: 'ISR', amount: record.ISR ?? 0 },
    ],
    downloadUrl: record.URL_BOLETA ?? undefined,
    diasGozados: record.DIAS_GOZADOS ?? 0,
    diasPagados: record.DIAS_PAGADOS ?? 0
  }
}

// ✅ Historial completo
export const getPayrollForUser = async (user: User): Promise<PayrollPayment[]> => {
  const cleanedId = sanitizeId(user.id)
  const data = await fetchJson(`/indicadores?TIPO=SUELDO&EMPLEADO_ID=${cleanedId}`)
  const records = data?.recordset ?? []

  return records.map((record: any) => ({
    amount: record.SUELDO,
    date: record.FECHA_PAGO ?? new Date().toISOString(),
    earnings: [{ label: 'Sueldo base', amount: record.SUELDO }],
    deductions: [
      { label: 'IGSS', amount: record.IGSS ?? 0 },
      { label: 'ISR', amount: record.ISR ?? 0 },
    ],
    downloadUrl: record.URL_BOLETA ?? undefined,
    diasGozados: record.DIAS_GOZADOS ?? 0,
    diasPagados: record.DIAS_PAGADOS ?? 0,

  }))
}
