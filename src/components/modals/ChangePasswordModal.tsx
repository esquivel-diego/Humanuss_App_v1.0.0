import { useState } from 'react'

interface Props {
    open: boolean
    onClose: () => void
}

const ChangePasswordModal = ({ open, onClose }: Props) => {
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (next !== confirm) {
            alert('❌ Las contraseñas no coinciden.')
            return
        }

        // Simular envío
        alert('✅ Contraseña actualizada (simulado)')
        onClose()
        setCurrent('')
        setNext('')
        setConfirm('')
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={next}
                        onChange={(e) => setNext(e.target.value)}
                        className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
