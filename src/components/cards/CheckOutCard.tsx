import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { useAttendanceStore } from '@store/attendanceStore'
import { getAsistenciaDeHoy, postMarcajeV2, toLocalYMD } from '@services/marcajeService'

const CheckOutCard = () => {
  const [time, setTime] = useState<string | null>(null)
  const user = useAuthStore((s) => s.user)
  const markCheckOut = useAttendanceStore((s) => s.markCheckOut)
  const getWeek = useAttendanceStore((s) => s.getWeek)
  const fetchWeek = useAttendanceStore((s) => s.fetchWeek)

  const formatTime = (d: Date) => {
    const h = d.getHours(), m = d.getMinutes()
    const hour = h % 12 || 12, meridian = h < 12 ? 'A.M' : 'P.M'
    return `${hour.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${meridian}`
  }
  const getCurrentDayName = () => new Intl.DateTimeFormat('es-ES',{weekday:'long'}).format(new Date())
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const handleCheckOut = async () => {
    if (!user) return
    if (time && !confirm('Ya registraste tu salida. ¿Deseas volver a marcar?')) return

    const now = new Date()
    const hora = now.toTimeString().slice(0,5)
    const fechaLocal = toLocalYMD(now)
    const today = capitalize(getCurrentDayName())

    try {
      // Backend (local y fallback UTC)
      const todayAtt = await getAsistenciaDeHoy(now)
      const hasInBackend = !!todayAtt?.HORA_ENTRADA
      const hasOutBackend = !!todayAtt?.HORA_SALIDA

      // Store local
      const todayLocal = getWeek(user.id).find(d => d.day === today)
      const hasInLocal = !!todayLocal?.checkIn
      const hasOutLocal = !!todayLocal?.checkOut

      console.log("🔎 Pre-chequeo checkout:", {
        hasInBackend, hasOutBackend, hasInLocal, hasOutLocal, todayAtt, todayLocal
      })

      if (!hasInBackend && !hasInLocal) {
        alert('No tienes CHECK-IN registrado hoy. Marca entrada primero.')
        return
      }
      if (hasOutBackend) {
        alert('Ya tienes CHECK-OUT registrado hoy en el sistema.')
        return
      }

      const payload = {
        LATITUD: 0.0,
        LONGITUD: 0.0,
        ID_DISPOSITIVO: 'HUMANUSS_WEBAPP',
        ENTRADASALIDA: 'S' as const,
        FECHA_REGISTRO: fechaLocal, // <-- local
      }
      console.log('📤 POST /v2/MARCAJE (S):', payload)
      const res = await postMarcajeV2(payload)
      console.log('✅ Respuesta marcaje (S):', res)

      markCheckOut(user.id, today, hora)
      await fetchWeek(user)

      const updated = getWeek(user.id).find(d => d.day === today)
      if (updated?.checkOut) {
        const [h,m] = updated.checkOut.split(':').map(Number)
        const d = new Date(); d.setHours(h,m)
        setTime(formatTime(d))
      } else {
        setTime(formatTime(now))
      }
    } catch (err) {
      console.error('❌ Error al registrar salida (S):', err)
      alert('Hubo un error al registrar tu salida.')
    }
  }

  useEffect(() => {
    if (!user) return
    const today = capitalize(getCurrentDayName())
    const todayData = getWeek(user.id).find(d => d.day === today)
    if (todayData?.checkOut) {
      const [h,m] = todayData.checkOut.split(':').map(Number)
      const d = new Date(); d.setHours(h,m)
      setTime(formatTime(d))
    }
  }, [user, getWeek])

  const isMarked = !!time

  return (
    <div onClick={handleCheckOut}
      className={`card-bg rounded-2xl shadow-md transition-transform p-4 cursor-pointer flex flex-col items-center justify-center h-36 w-full
      ${isMarked ? 'border-2 border-pink-500' : 'hover:ring-2 hover:ring-pink-300 hover:scale-[1.02]'}`}>
      <div className="flex items-center justify-between w-full text-xs font-semibold text-black dark:text-white">
        <span>CHECK-OUT</span>
        <LogOut className="text-pink-500 rotate-180" size={16} />
      </div>
      <div className="text-2xl font-bold text-black dark:text-white mt-2">
        {time || '--:--'}
      </div>
      {isMarked && (
        <p className="text-[11px] text-gray-400 italic mt-1 text-center leading-tight">
          Último registro: {time}
        </p>
      )}
    </div>
  )
}
export default CheckOutCard
