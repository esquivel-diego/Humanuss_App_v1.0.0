import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/accordion'

const Profile = () => {
  const user = {
    name: 'Diego Esquivel',
    position: 'Desarrollador de software',
    photoUrl: 'https://i.pravatar.cc/300?u=diego',
    contact: {
      address: 'Edificio Campus Tec I Vía 4 1-00 Ciudad de Guatemala',
      phone: '5555 - 5555',
      mobile: '3333 - 3333',
      email: 'colaborador@onesolutionsgroup.com',
      startDate: '2025-03-15',
    },
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Card principal con foto */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 text-center shadow-md">
        <img
          src={user.photoUrl}
          alt="Foto de perfil"
          className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white dark:border-gray-700 -mt-16 shadow-md"
        />
        <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user.position}</p>
      </div>

      {/* Secciones desplegables */}
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="contacto">
          <AccordionTrigger>CONTACTO</AccordionTrigger>
          <AccordionContent className="space-y-1 text-sm">
            <div>📍 {user.contact.address}</div>
            <div>📞 {user.contact.phone}</div>
            <div>📱 {user.contact.mobile}</div>
            <div>✉️ {user.contact.email}</div>
            <div>📅 {new Date(user.contact.startDate).toLocaleDateString()}</div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experiencia">
          <AccordionTrigger>EXPERIENCIA</AccordionTrigger>
          <AccordionContent>
            Información de experiencia laboral del colaborador.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="educacion">
          <AccordionTrigger>EDUCACIÓN</AccordionTrigger>
          <AccordionContent>
            Formación académica, cursos o certificaciones.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="organigrama">
          <AccordionTrigger>ORGANIGRAMA</AccordionTrigger>
          <AccordionContent>
            Visualización del organigrama futuro.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Profile
