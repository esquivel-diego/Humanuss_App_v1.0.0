import { useNavigate } from 'react-router-dom'
import { Plane, CalendarX } from 'lucide-react'

const ModulesMobile = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-md mx-auto space-y-4">
        {/* Encabezado */}
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow">
          Módulos
        </div>

        {/* Opción: Vacaciones */}
        <div
          onClick={() => navigate('/modules/vacaciones')}
          className="card-bg rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition flex items-center gap-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <Plane size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Vacaciones</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Solicitar días</p>
          </div>
          <span className="text-xl text-gray-400">›</span>
        </div>

        {/* Opción: Ausencias */}
        <div
          onClick={() => navigate('/modules/ausencias')}
          className="card-bg rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition flex items-center gap-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <CalendarX size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Ausencias</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Registrar solicitudes</p>
          </div>
          <span className="text-xl text-gray-400">›</span>
        </div>
      </div>
    </div>
  )
}

export default ModulesMobile
