import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@hooks/useTheme'
import ChangePasswordModal from '@components/modals/ChangePasswordModal'
import { useAuthStore } from '@store/authStore'
import { getAuthenticatedEmployeeV2 } from '@services/employeeService'

interface ContactInfo {
  address: string
  phone: string
  mobile: string
  email: string
  startDate: string
}

interface UserProfile {
  userId: string
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
    const fetchProfile = async () => {
      if (!user) return

      try {
        // Preferimos API oficial v2
        const { record, photoDataUrl } = await getAuthenticatedEmployeeV2()

        // Fallback con datos de authStore si algo viene vacío
        const name = record?.NOMBRE_USUAL?.trim() || user.name || ''
        const position = record?.DESCRIPCION_PUESTO || user.position || ''
        const email = record?.DIRECCION_EMAIL || user.username || ''
        const phone = record?.TELEFONO || ''
        const address = record?.DIRECCION_DOMICILIO || ''
        const photoUrl = photoDataUrl || user.photoUrl || '/default-avatar.svg'

        const parsed: UserProfile = {
          userId: String(user.id),
          name,
          position,
          photoUrl,
          contact: {
            address,
            phone,
            mobile: '', // no disponible en v2
            email,
            startDate: '', // no disponible en v2
          },
        }

        setProfile(parsed)
      } catch (err) {
        console.error('Error al cargar perfil (v2):', err)
        // Si falla v2, al menos muestra algo con authStore
        setProfile({
          userId: String(user.id),
          name: user.name,
          position: user.position || '',
          photoUrl: user.photoUrl || '/default-avatar.svg',
          contact: {
            address: '',
            phone: '',
            mobile: '',
            email: user.username,
            startDate: '',
          },
        })
      }
    }

    fetchProfile()
  }, [user])

  if (!user || !profile) return null

  return (
    <div className="w-full px-4 py-6 max-w-4xl mx-auto space-y-6">
      <div
        onClick={() => navigate('/profile')}
        className="card-bg rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 shadow min-h-[120px] text-center md:text-left cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
      >
        <img
          src={profile.photoUrl || '/default-avatar.svg'}
          alt="Foto de perfil"
          className="w-40 h-40 md:w-20 md:h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.position}</p>
          <p className="text-xs text-gray-400">{profile.contact.email}</p>
        </div>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="card-bg w-full flex justify-between items-center px-4 py-3 rounded-xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <span className="text-sm font-medium">Cambiar contraseña</span>
        <span className="text-xl">›</span>
      </button>

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

      <ChangePasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default Settings
