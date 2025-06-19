export interface PaymentDetail {
  label: string
  amount: number
}

export interface Payment {
  date: string
  amount: number
  downloadUrl?: string
  earnings: PaymentDetail[]
  deductions: PaymentDetail[]
}

export interface PayrollEntry {
  userId: number
  payments: Payment[]
}
