import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Settings, Boxes } from 'lucide-react'
import { useMemo } from 'react'

/**
 * Menú inferior móvil (solo íconos)
 * - Ocupa casi todo el ancho (con márgenes laterales)
 * - Fijo al fondo
 * - Íconos centrados y distribuidos equitativamente
 */
const MobileNav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const items = useMemo(
    () => [
      { key: 'settings', icon: Settings, path: '/mobile/settings' },
      { key: 'home', icon: Home, path: '/dashboard' }, // ✅ Ahora redirige a dashboard
      { key: 'modules', icon: Boxes, path: '/mobile/modules' },
    ],
    []
  )

  const isActive = (path: string) => pathname === path

  return (
    <nav
      className="
        md:hidden
        fixed
        bottom-4
        left-3
        right-3
        z-50
      "
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Menú móvil"
    >
      <div
        className="
          w-full
          bg-[#0d2347] text-white
          rounded-full shadow-xl
          px-6 py-3
          flex items-center justify-between
        "
      >
        {items.map(({ key, icon: Icon, path }) => {
          const active = isActive(path)
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`
                flex items-center justify-center
                w-1/3 h-10
                rounded-full transition
                focus:outline-none
                ${active ? 'bg-blue-600/90 shadow-md' : 'hover:bg-white/10'}
              `}
              aria-label={key}
            >
              <Icon
                size={24}
                className={`${active ? 'text-blue-300 scale-110' : 'text-white'} transition-transform`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
