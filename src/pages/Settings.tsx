import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@hooks/useTheme'
import ChangePasswordModal from '@components/modals/ChangePasswordModal'
import { useAuthStore } from '@store/authStore'
import rawProfileData from '@mocks/profile.json'

interface ContactInfo {
  address: string
  phone: string
  mobile: string
  email: string
  startDate: string
}

interface UserProfile {
  userId: number
  name: string
  position: string
  photoUrl: string
  contact: ContactInfo
}

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      const profiles = Array.isArray(rawProfileData) ? rawProfileData : []
      const found = profiles.find((p) => p.userId === user.id)
      setProfile(found || null)
    }
  }, [user])

  if (!user || !profile) return null

  return (
    <div className="w-full px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Perfil */}
      <div
        onClick={() => navigate('/profile')}
        className="card-bg rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 shadow min-h-[120px] text-center md:text-left cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
      >
        <img
          src={profile.photoUrl}
          alt="Foto de perfil"
          className="w-40 h-40 md:w-20 md:h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.position}</p>
          <p className="text-xs text-gray-400">{profile.contact.email}</p>
        </div>
      </div>

      {/* Cambiar contraseña */}
      <button
        onClick={() => setModalOpen(true)}
        className="card-bg w-full flex justify-between items-center px-4 py-3 rounded-xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <span className="text-sm font-medium">Cambiar contraseña</span>
        <span className="text-xl">›</span>
      </button>

      {/* Modo oscuro */}
      <div className="card-bg flex justify-between items-center px-4 py-3 rounded-xl shadow">
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
