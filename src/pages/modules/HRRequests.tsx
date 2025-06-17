import { useState } from 'react'

const HRRequests = () => {
  const [requestDate, setRequestDate] = useState('')
  const [requestType, setRequestType] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!requestDate || !requestType || !message) {
      alert('Completa todos los campos obligatorios.')
      return
    }

    // Aquí podrías manejar el archivo también si se necesita.
    console.log({ requestDate, requestType, message, file })

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)

    setRequestDate('')
    setRequestType('')
    setMessage('')
    setFile(null)
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          {/* Título */}
          <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow text-center">
            Solicitud RRHH
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

              {/* Tipo de solicitud */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  Tipo de solicitud
                </label>
                <input
                  type="text"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  placeholder="Ej. Constancia salarial, carta laboral..."
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  required
                />
              </div>

              {/* Adjuntar archivo */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  Documento adjunto (opcional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-gray-100 dark:bg-gray-700 rounded-md text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700"
                />
              </div>

              {/* Mensaje o motivo */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  Motivo o mensaje
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe brevemente tu solicitud"
                  className="w-full h-24 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 resize-none focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Botón al fondo */}
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

export default HRRequests
