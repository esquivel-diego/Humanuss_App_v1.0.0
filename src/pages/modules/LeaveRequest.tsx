import { useEffect, useState } from 'react'
import DateRangeModal from '@components/modals/DateRangeModal'
import { createRequest } from '@services/requestService'
import { useNotificationStore } from '@store/notificationStore'
import { useAuthStore } from '@store/authStore'

const LeaveRequest = () => {
  const [requestDate, setRequestDate] = useState('')
  const [dates, setDates] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [daysToTake, setDaysToTake] = useState<number | ''>('')
  const [period, setPeriod] = useState('N/A')

  const user = useAuthStore.getState().user
  const { addNotification } = useNotificationStore()

  // ✅ Determinar periodo actual basado en año vigente
  useEffect(() => {
    const fetchPeriod = () => {
      const year = new Date().getFullYear()
      setPeriod(`${year}-${year}`)
    }

    fetchPeriod()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !user.id || !requestDate || !dates) {
      alert('Completa todos los campos obligatorios.')
      return
    }

    try {
      await createRequest(user, {
        type: 'Vacación',
        date: requestDate,
        range: dates,
        notes,
        daysToTake: typeof daysToTake === 'number' ? daysToTake : 0,
      })

      addNotification({
        userId: user.id,
        message: 'Tu solicitud de vacaciones fue enviada y está pendiente de aprobación.',
        date: new Date().toISOString(),
        read: false,
      })

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)

      setRequestDate('')
      setDates('')
      setNotes('')
      setDaysToTake('')
    } catch (error) {
      console.error('Error al enviar solicitud:', error)
      alert('❌ Ocurrió un error al enviar la solicitud.')
    }
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-white p-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col justify-center">
        <div className="card-bg flex flex-col flex-1 rounded-2xl shadow-xl p-6 pt-10">
          <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow text-center">
            Solicitud de vacaciones
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 mt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Fecha de solicitud
                </label>
                <input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">
                  Periodo que afecta
                </label>
                <input
                  type="text"
                  value={period}
                  readOnly
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">
                  Fechas
                </label>
                <input
                  type="text"
                  value={dates}
                  onClick={() => setShowCalendar(true)}
                  readOnly
                  placeholder="Ej. del 5 al 10 de julio"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none cursor-pointer"
                  required
                />
              </div>

              <DateRangeModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                onSelectRange={(range) => setDates(range)}
              />

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-semibold block mb-1">
                    Días disponibles
                  </label>
                  <input
                    value="9"
                    disabled
                    className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold block mb-1">
                    Días a gozar
                  </label>
                  <input
                    type="number"
                    value={daysToTake}
                    onChange={(e) => setDaysToTake(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">
                  Observaciones
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="type here"
                  className="w-full h-24 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 resize-none focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-6">
              <div className="max-w-md mx-auto w-full">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
                >
                  ENVIAR
                </button>
              </div>

              {submitted && (
                <div className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded-md">
                  ✅ Tu solicitud fue enviada correctamente.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LeaveRequest
