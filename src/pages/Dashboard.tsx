import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DaysCard from '@components/cards/DaysCard'
import PayrollCard from '@components/cards/PayrollCard'
import AttendanceCard from '@components/cards/AttendanceCard'
import CheckInCard from '@components/cards/CheckInCard'
import CheckOutCard from '@components/cards/CheckOutCard'
import { useAuthStore } from '@store/authStore'
import { fetchJson } from '@utils/apiClient'

const Dashboard = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [displayName, setDisplayName] = useState<string>(user?.name ?? 'Usuario')
  const [puesto, setPuesto] = useState<string>(
    user?.role === 'admin' ? 'Administrador' : 'Colaborador'
  )
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    user?.photoUrl && user.photoUrl.trim() !== '' ? user.photoUrl : null
  )

  useEffect(() => {
    document.title = 'Humanuss | Dashboard'
  }, [])

  useEffect(() => {
    const bytesToDataUrl = (bytes?: number[] | Uint8Array | null): string | null => {
      if (!bytes || (Array.isArray(bytes) && bytes.length === 0)) return null
      const arr = Array.isArray(bytes) ? new Uint8Array(bytes) : bytes
      if (!arr || arr.length === 0) return null

      // Detecta PNG (89 50 4E 47) o JPEG (FF D8 FF)
      let mime = 'image/png'
      if (arr.length > 3) {
        const s0 = arr[0], s1 = arr[1], s2 = arr[2], s3 = arr[3]
        const isPng = s0 === 137 && s1 === 80 && s2 === 78 && s3 === 71
        const isJpg = s0 === 255 && s1 === 216 && s2 === 255
        if (isJpg) mime = 'image/jpeg'
        else if (isPng) mime = 'image/png'
      }

      let binary = ''
      const chunk = 0x8000
      for (let i = 0; i < arr.length; i += chunk) {
        const sub = arr.subarray(i, i + chunk)
        binary += String.fromCharCode(...sub)
      }
      const base64 = btoa(binary)
      return `data:${mime};base64,${base64}`
    }

    const normalizeFoto = (foto: unknown): string | null => {
      if (!foto) return null
      if (typeof foto === 'string') {
        return foto.startsWith('data:image/')
          ? foto
          : `data:image/png;base64,${foto}`
      }
      if (typeof foto === 'object' && (foto as any).data && Array.isArray((foto as any).data)) {
        return bytesToDataUrl((foto as any).data as number[])
      }
      return null
    }

    const loadEmployee = async () => {
      try {
        // ✅ IMPORTANTE: con fetchJson pasamos SOLO "/v2/..." porque el cliente ya añade "/api/portal"
        const res = await fetchJson('/v2/EMPLEADO')
        const rec = res?.recordset?.[0]
        if (rec) {
          const nombre = (rec.NOMBRE_USUAL ?? '').toString().trim()
          const puestoTxt = (rec.DESCRIPCION_PUESTO ?? '').toString().trim()
          const fotoDataUrl = normalizeFoto(rec.FOTO)
          if (nombre) setDisplayName(nombre)
          if (puestoTxt) setPuesto(puestoTxt)
          if (fotoDataUrl) setPhotoUrl(fotoDataUrl)
          return
        }
        console.warn('EMPLEADO sin recordset válido (cliente). Probando fallback...')
      } catch (err) {
        console.warn('Cliente no logró EMPLEADO. Probando fallback directo...', err)
      }

      // Fallback directo con baseUrl + token explícito (por si la inyección automática fallara)
      try {
        const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? ''
        const token =
          localStorage.getItem('TOKENLOG') || sessionStorage.getItem('TOKENLOG') || ''
        if (!baseUrl || !token) {
          console.warn('No hay baseUrl o token para fallback directo.')
          return
        }
        const url = `${baseUrl}/api/portal/v2/EMPLEADO?token=${encodeURIComponent(token)}`
        const r = await fetch(url)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = await r.json()
        const rec = data?.recordset?.[0]
        if (rec) {
          const nombre = (rec.NOMBRE_USUAL ?? '').toString().trim()
          const puestoTxt = (rec.DESCRIPCION_PUESTO ?? '').toString().trim()
          const fotoDataUrl = normalizeFoto(rec.FOTO)
          if (nombre) setDisplayName(nombre)
          if (puestoTxt) setPuesto(puestoTxt)
          if (fotoDataUrl) setPhotoUrl(fotoDataUrl)
          return
        }
        console.warn('EMPLEADO sin recordset válido (fallback).')
      } catch (err) {
        console.warn('Fallback directo EMPLEADO falló:', err)
      }
    }

    loadEmployee()
  }, [user])

  const avatar =
    photoUrl ??
    (user?.photoUrl && user.photoUrl.trim() !== '' ? user.photoUrl : 'default-avatar.svg')

  return (
    <div className="max-w-5xl mx-auto grid gap-6 px-4 pb-4">
      {/* Sección de usuario */}
      <div className="flex items-center justify-between px-2 py-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {displayName || 'Usuario'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {puesto || (user?.role === 'admin' ? 'Administrador' : 'Colaborador')}
          </p>
        </div>
        <img
          onClick={() => navigate('/profile')}
          src={avatar}
          alt="Foto de perfil"
          className="w-14 h-14 rounded-full object-cover shadow-md cursor-pointer hover:brightness-110 transition"
        />
      </div>

      {/* Fila 1: Days + Payroll */}
      <div className="grid grid-cols-1 xlgrid:grid-cols-2 gap-6">
        <DaysCard />
        <PayrollCard />
      </div>

      {/* Fila 2: Attendance */}
      <div>
        <AttendanceCard />
      </div>

      {/* Fila 3: Check-in + Check-out */}
      <div className="grid grid-cols-2 gap-4">
        <CheckInCard />
        <CheckOutCard />
      </div>
    </div>
  )
}

export default Dashboard
