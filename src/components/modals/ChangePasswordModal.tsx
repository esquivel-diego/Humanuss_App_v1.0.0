import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const ChangePasswordModal = ({ open, onClose }: Props) => {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (next !== confirm) {
      alert('❌ Las contraseñas no coinciden.')
      return
    }

    alert('✅ Contraseña actualizada (simulado)')
    onClose()
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="card-bg rounded-2xl shadow-xl p-6 w-full max-w-md border dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Cambiar contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo contraseña actual */}
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Contraseña actual"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Campo nueva contraseña */}
          <div className="relative">
            <input
              type={showNext ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowNext(!showNext)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
            >
              {showNext ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Campo confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
