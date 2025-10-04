import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/accordion'
import { useAuthStore } from '@store/authStore'
import { useEffect, useState } from 'react'
import { getAuthenticatedEmployeeV2 } from '@services/employeeService'
import { useNotificationStore } from '@store/notificationStore' // ✅ agregado
import { useNavigate } from 'react-router-dom' // ✅ agregado
import { Bell } from 'lucide-react' // ✅ agregado

interface ContactInfo {
  address: string
  phone: string
  email: string
}

interface UserProfile {
  userId: string | number
  name: string
  position: string
  photoUrl: string
  contact: ContactInfo
}

const Profile = () => {
  const user = useAuthStore((state) => state.user)
  const notifications = useNotificationStore((state) => state.notifications) // ✅ agregado
  const navigate = useNavigate() // ✅ agregado

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showFullImage, setShowFullImage] = useState(false)

  // ✅ no leídas del usuario (para el badge rojo en el botón)
  const unreadCount = notifications.filter(
    (n) => !n.read && String(n.userId) === user?.id
  ).length

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        const { record, photoDataUrl } = await getAuthenticatedEmployeeV2()
        if (!record) return

        const mapped: UserProfile = {
          userId: user.id,
          name: (record.NOMBRE_USUAL || user.name || '').trim(),
          position: record.DESCRIPCION_PUESTO || user.position || 'Colaborador',
          photoUrl: photoDataUrl || user.photoUrl || 'https://i.pravatar.cc/300',
          contact: {
            address: record.DIRECCION_DOMICILIO || 'No disponible',
            phone: record.TELEFONO || 'N/A',
            email: record.DIRECCION_EMAIL || 'N/A',
          },
        }

        setProfile(mapped)
      } catch (err) {
        console.error('Error al cargar perfil:', err)
      }
    }

    fetchProfile()
  }, [user])

  if (!profile) return null

  return (
    <div className="min-h-screen pt-20 px-4 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="relative card-bg rounded-2xl p-6 text-center shadow-xl pt-20">
          {/* ✅ Botón de Notificaciones en la esquina sup. derecha, con badge rojo si hay no leídas */}
          <button
            onClick={() => navigate('/notificaciones')}
            className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <span className="relative inline-flex">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              )}
            </span>
          </button>

          <img
            src={profile.photoUrl}
            alt="Foto de perfil"
            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 absolute left-1/2 -translate-x-1/2 -top-14 shadow-md cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
          <h2 className="text-xl font-semibold mt-4">{profile.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{profile.position}</p>
        </div>

        {/* Solo CONTACTO */}
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="contacto">
            <AccordionTrigger className="hover:no-underline hover:text-blue-500 hover:scale-[1.01] transition-all">
              CONTACTO
            </AccordionTrigger>
            <AccordionContent className="space-y-1 text-sm">
              <div>📍 {profile.contact.address}</div>
              <div>📞 {profile.contact.phone}</div>
              <div>✉️ {profile.contact.email}</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={profile.photoUrl}
            alt="Foto ampliada"
            className="w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full object-cover border-4 border-white shadow-xl"
          />
        </div>
      )}
    </div>
  )
}

export default Profile
