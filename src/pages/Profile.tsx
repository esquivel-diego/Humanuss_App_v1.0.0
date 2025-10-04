// src/pages/Profile.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/accordion'
import { useAuthStore } from '@store/authStore'
import { useEffect, useState } from 'react'
import { getAuthenticatedEmployeeV2 } from '@services/employeeService'

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
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showFullImage, setShowFullImage] = useState(false)

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
