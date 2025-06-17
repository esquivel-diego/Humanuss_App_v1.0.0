import { useState } from 'react'
import { useTheme } from '@hooks/useTheme'
import ChangePasswordModal from '@components/modals/ChangePasswordModal'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)

  const user = {
    name: 'Diego Esquivel',
    position: 'Desarrollador de software',
    email: 'diego.esquivel@onesolutionsgroup.com',
    avatar: 'https://i.pravatar.cc/300?u=diego',
  }

  return (
    <div className="w-full px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 shadow min-h-[120px] text-center md:text-left">
        <img
  src={user.avatar}
  alt="Foto de perfil"
  className="w-40 h-40 md:w-20 md:h-20 rounded-full object-cover border"
/>

        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.position}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Cambiar contraseña */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <span className="text-sm font-medium">Cambiar contraseña</span>
        <span className="text-xl">›</span>
      </button>

      {/* Modo oscuro */}
      <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow">
        <span className="text-sm font-medium">Dark mode</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="sr-only"
          />
          <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full p-1 flex items-center transition-all">
            <div
              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                theme === 'dark' ? 'translate-x-5' : ''
              }`}
            />
          </div>
        </label>
      </div>

      {/* Modal */}
      <ChangePasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default Settings
