import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { getLastPayroll } from '@services/payrollService'

interface PayrollData {
  amount: number
  date: string
  periodo?: string      // PERIODO_AAMM
  tipo?: string         // GRUPO_PAGO_DESC
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
        if (data && typeof data.amount === 'number' && typeof data.date === 'string') {
          setLastPayment({
            amount: data.amount,
            date: data.date,
            periodo: data.periodo,
            tipo: data.tipo,
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

  if (!lastPayment || !lastPayment.amount) {
    return (
      <div className="card-bg rounded-2xl shadow px-10 py-4">
        <p className="text-sm text-gray-500 text-center">No hay datos de nómina disponibles</p>
      </div>
    )
  }

  const { amount, periodo, tipo } = lastPayment
  const year = periodo?.slice(0, 4) ?? ''
  const mesNum = parseInt(periodo?.slice(5, 7) ?? '1', 10)
  const month = new Date(2000, mesNum - 1).toLocaleString('es-ES', {
    month: 'long',
  }).toUpperCase()

  return (
    <div
      onClick={() => navigate('/payroll')}
      className="card-bg rounded-2xl shadow px-10 py-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition h-full"
    >
      <div className="flex flex-col justify-center h-full">
        <div className="flex justify-between items-center text-left">
          <div>
            <p className="text-xs text-gray-500">{year}</p>
            <p className="text-md font-bold text-gray-800 dark:text-white">
              {month?.toUpperCase() ?? ''}
            </p>
            <p className="text-xs text-gray-500">{tipo}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              Q{amount.toLocaleString('es-GT', {
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
