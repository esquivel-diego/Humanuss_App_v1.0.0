import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { getLastPayroll } from '@services/payrollService'

interface PayrollData {
  amount: number
  date: string
}

const PayrollCard = () => {
  const [lastPayment, setLastPayment] = useState<PayrollData | null>(null)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!user || !user.id) return

      try {
        const data = await getLastPayroll()

        if (
          data &&
          typeof data === 'object' &&
          typeof data.amount === 'number' &&
          typeof data.date === 'string'
        ) {
          setLastPayment({
            amount: data.amount,
            date: data.date,
          })
        } else {
          console.warn('⚠️ Último pago inválido o vacío:', data)
        }
      } catch (err) {
        console.error('❌ Error al cargar nómina:', err)
      }
    }

    fetchPayroll()
  }, [user])

  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.toLocaleString('es-ES', { month: 'long' }).toUpperCase()
    return {
      year: date.getFullYear(),
      month,
      quincena: date.getDate() <= 15 ? 'PRIMERA QUINCENA' : 'SEGUNDA QUINCENA',
    }
  }

  if (!lastPayment || !lastPayment.amount) {
    return (
      <div className="card-bg rounded-2xl shadow px-10 py-4">
        <p className="text-sm text-gray-500 text-center">No hay datos de nómina disponibles</p>
      </div>
    )
  }

  const { year, month, quincena } = formatMonth(lastPayment.date)

  return (
    <div
      onClick={() => navigate('/payroll')}
      className="card-bg rounded-2xl shadow px-10 py-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition h-full"
    >
      <div className="flex flex-col justify-center h-full">
        <div className="flex justify-between items-center text-left">
          <div>
            <p className="text-xs text-gray-500">{year}</p>
            <p className="text-md font-bold text-gray-800 dark:text-white">{month}</p>
            <p className="text-xs text-gray-500">{quincena}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              Q{lastPayment.amount.toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollCard
