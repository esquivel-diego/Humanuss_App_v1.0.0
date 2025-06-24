import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/accordion'
import { useAuthStore } from '@store/authStore'
import { useEffect, useState } from 'react'

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
  experience?: string
  education?: string
}

const Profile = () => {
  const user = useAuthStore((state) => state.user)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showFullImage, setShowFullImage] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const API_URL = import.meta.env.VITE_API_URL
        const res = await fetch(`${API_URL}/empleado/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        const data = await res.json()
        const record = data?.recordset?.[0]

        if (!record) return

        const mapped: UserProfile = {
          userId: record.EMPLEADO_ID,
          name: record.NOMBRE,
          position: record.PUESTO || 'Colaborador',
          photoUrl: record.FOTO_URL || 'https://i.pravatar.cc/300',
          contact: {
            address: record.DIRECCION || 'No disponible',
            phone: record.TEL_FIJO || 'N/A',
            mobile: record.TEL_MOVIL || 'N/A',
            email: record.EMAIL || 'N/A',
            startDate: record.FECHA_INGRESO || new Date().toISOString(),
          },
          experience: record.EXPERIENCIA || '',
          education: record.EDUCACION || '',
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
        {/* Card principal con foto */}
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

        {/* Secciones desplegables */}
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="contacto">
            <AccordionTrigger className="hover:no-underline hover:text-blue-500 hover:scale-[1.01] transition-all">
              CONTACTO
            </AccordionTrigger>
            <AccordionContent className="space-y-1 text-sm">
              <div>📍 {profile.contact.address}</div>
              <div>📞 {profile.contact.phone}</div>
              <div>📱 {profile.contact.mobile}</div>
              <div>✉️ {profile.contact.email}</div>
              <div>📅 {new Date(profile.contact.startDate).toLocaleDateString()}</div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experiencia">
            <AccordionTrigger className="hover:no-underline hover:text-blue-500 hover:scale-[1.01] transition-all">
              EXPERIENCIA
            </AccordionTrigger>
            <AccordionContent>
              {profile.experience || 'Información de experiencia laboral del colaborador.'}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="educacion">
            <AccordionTrigger className="hover:no-underline hover:text-blue-500 hover:scale-[1.01] transition-all">
              EDUCACIÓN
            </AccordionTrigger>
            <AccordionContent>
              {profile.education || 'Formación académica, cursos o certificaciones.'}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="organigrama">
            <AccordionTrigger className="hover:no-underline hover:text-blue-500 hover:scale-[1.01] transition-all">
              ORGANIGRAMA
            </AccordionTrigger>
            <AccordionContent>
              Visualización del organigrama futuro.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Modal imagen ampliada */}
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
