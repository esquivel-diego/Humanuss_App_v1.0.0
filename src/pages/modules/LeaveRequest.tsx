import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css' // Si necesitas la base
import '../../styles/calendar.css' // ✅ Tu CSS personalizado

const LeaveRequest = () => {
  const [requestDate, setRequestDate] = useState('')
  const [absenceType, setAbsenceType] = useState('')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!requestDate || !absenceType || !selectedDay) {
      alert('Completa todos los campos obligatorios.')
      return
    }

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)

    setRequestDate('')
    setAbsenceType('')
    setSelectedDay(null)
    setNotes('')
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold bg-blue-900 text-white p-3 rounded-xl text-center">
        Solicitud de ausencia
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={requestDate}
          onChange={(e) => setRequestDate(e.target.value)}
          className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
          required
        />

        <input
          type="text"
          value={absenceType}
          onChange={(e) => setAbsenceType(e.target.value)}
          className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
          placeholder="Tipo de ausencia"
          required
        />

        <div className="bg-white dark:bg-gray-900 p-2 rounded border dark:border-gray-700">
          <Calendar
            onChange={(date) => setSelectedDay(date as Date)}
            value={selectedDay}
            locale="es-ES"
          />
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-24 px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 resize-none"
          placeholder="Observaciones"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          ENVIAR
        </button>

        {submitted && (
          <div className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded-md">
            ✅ Tu solicitud fue enviada correctamente.
          </div>
        )}
      </form>
    </div>
  )
}

export default LeaveRequest
