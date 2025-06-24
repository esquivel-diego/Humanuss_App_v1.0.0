// src/services/payrollService.ts

import type { User } from './authService'

export type PayrollPayment = {
  amount: number
  date: string
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  downloadUrl?: string
}

const API_URL = import.meta.env.VITE_API_URL

// Último pago
export const getLastPayroll = async (user: User): Promise<PayrollPayment | null> => {
  const res = await fetch(`${API_URL}/indicadores/${user.id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })

  if (!res.ok) throw new Error('Error al obtener datos de nómina')

  const data = await res.json()
  const record = data?.recordset?.[0]

  if (!record || !record.SUELDO) return null

  return {
    amount: record.SUELDO,
    date: record.FECHA_PAGO ?? new Date().toISOString(),
    earnings: [
      { label: 'Sueldo base', amount: record.SUELDO },
      // Puedes mapear más ingresos desde backend aquí si existen
    ],
    deductions: [
      { label: 'IGSS', amount: record.IGSS ?? 0 },
      { label: 'ISR', amount: record.ISR ?? 0 },
      // Más deducciones si aplican
    ],
    downloadUrl: record.URL_BOLETA ?? undefined
  }
}

// Historial de pagos completo
export const getPayrollForUser = async (user: User): Promise<PayrollPayment[]> => {
  const res = await fetch(`${API_URL}/indicadores/${user.id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })

  if (!res.ok) throw new Error('Error al obtener historial de pagos')

  const data = await res.json()
  const records = data?.recordset ?? []

  return records.map((record: any) => ({
    amount: record.SUELDO,
    date: record.FECHA_PAGO ?? new Date().toISOString(),
    earnings: [
      { label: 'Sueldo base', amount: record.SUELDO },
    ],
    deductions: [
      { label: 'IGSS', amount: record.IGSS ?? 0 },
      { label: 'ISR', amount: record.ISR ?? 0 },
    ],
    downloadUrl: record.URL_BOLETA ?? undefined
  }))
}
