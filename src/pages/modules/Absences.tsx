import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../../styles/calendar.css'

const Absences = () => {
    const [requestDate, setRequestDate] = useState('')
    const [absenceType, setAbsenceType] = useState('')
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)
    const [notes, setNotes] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

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
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white p-6 flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden space-y-6 px-6 py-6">
                {/* Título */}
                <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow text-center">
                    Solicitud de ausencia
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Sección inputs */}
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

                        {/* Tipo de ausencia */}
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                                Tipo de ausencia
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
                    </div>

                    {/* Calendario centrado */}
                    <div className="flex justify-center">
                        <div className="max-w-md w-full">
                            <Calendar
                                onChange={(date) => setSelectedDay(date as Date)}
                                value={selectedDay}
                                locale="es-ES"
                                className="bg-transparent"
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

                    {/* Botón centrado con mismo ancho del calendario */}
                    <div className="flex justify-center">
                        <div className="max-w-md w-full">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
                            >
                                ENVIAR
                            </button>
                        </div>
                    </div>

                    {/* Mensaje de éxito */}
                    {submitted && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded-md">
                            ✅ Tu solicitud fue enviada correctamente.
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Absences
