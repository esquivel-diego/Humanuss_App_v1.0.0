import { useTheme } from '@hooks/useTheme'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()

  const user = {
    name: 'Diego Esquivel',
    position: 'Desarrollador de software',
    email: 'diego.esquivel@onesolutionsgroup.com',
    avatar: 'https://i.pravatar.cc/300?u=diego',
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 shadow">
        <img
          src={user.avatar}
          alt="Foto de perfil"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.position}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Cambiar contraseña */}
      <button className="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <span className="text-sm font-medium">Cambiar contraseña</span>
        <span className="text-xl">›</span>
      </button>

      {/* Toggle modo oscuro */}
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
    </div>
  )
}

export default Settings
