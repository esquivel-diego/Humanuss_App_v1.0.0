import { useState } from 'react'

const LeaveRequest = () => {
  const [requestDate, setRequestDate] = useState('')
  const [absenceType, setAbsenceType] = useState('')
  const [dates, setDates] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!requestDate || !absenceType || !dates) {
      alert('Completa todos los campos obligatorios.')
      return
    }

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)

    setRequestDate('')
    setAbsenceType('')
    setDates('')
    setNotes('')
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
        {/* Card contenedor */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          {/* Título */}
          <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow text-center">
            Solicitud de vacaciones
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 mt-6">
            <div className="space-y-4">
              {/* Fecha de solicitud */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
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

              {/* Periodo que afecta */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  Periodo que afecta
                </label>
                <input
                  type="text"
                  value={absenceType}
                  onChange={(e) => setAbsenceType(e.target.value)}
                  placeholder="type here"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  required
                />
              </div>

              {/* Fechas */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  Fechas
                </label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Ej. del 5 al 10 de julio"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  required
                />
              </div>

              {/* Días disponibles / Días a gozar */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    Días disponibles
                  </label>
                  <input
                    value="9"
                    disabled
                    className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    Días a gozar
                  </label>
                  <input
                    type="number"
                    placeholder="type here"
                    className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
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

            {/* Botón */}
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
