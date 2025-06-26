// src/services/payrollService.ts
import type { User } from './authService'
import { fetchJson } from '@utils/apiClient'

export type PayrollPayment = {
  amount: number
  date: string
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  downloadUrl?: string
}

// ✅ Último pago del usuario
export const getLastPayroll = async (user: User): Promise<PayrollPayment | null> => {
  const data = await fetchJson(`/indicadores/SUELDO/${user.id}`)
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
  }
}

// ✅ Historial de pagos del usuario
export const getPayrollForUser = async (user: User): Promise<PayrollPayment[]> => {
  const data = await fetchJson(`/indicadores/SUELDO/${user.id}`)
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
  }))
}
