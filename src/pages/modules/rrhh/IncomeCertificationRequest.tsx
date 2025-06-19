import { useState } from 'react'

const IncomeCertificationRequest = () => {
  const [reason, setReason] = useState('')
  const [recipient, setRecipient] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason.trim() || !recipient.trim()) {
      alert('Por favor completa todos los campos obligatorios.')
      return
    }

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setReason('')
    setRecipient('')
  }

  return (
    <div className="h-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center">
        {/* Card contenedor */}
        <div className="card-bg flex flex-col flex-1 rounded-2xl shadow-xl p-6 pt-10">
          {/* Título */}
          <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow text-center">
            Solicitud de certificación de ingresos
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 mt-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  Motivo de solicitud
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Escribe aquí"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                  A quién va dirigida
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Escribe aquí"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  required
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

export default IncomeCertificationRequest
