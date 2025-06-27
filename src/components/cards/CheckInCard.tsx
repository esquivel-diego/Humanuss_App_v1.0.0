// src/components/cards/CheckInCard.tsx
import { useEffect, useState } from 'react'
import { LogIn } from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { useAttendanceStore } from '@store/attendanceStore'
import { postMarcajeLocal } from '@services/marcajeService'

const CheckInCard = () => {
  const [time, setTime] = useState<string | null>(null)
  const user = useAuthStore((state) => state.user)
  const markCheckIn = useAttendanceStore((state) => state.markCheckIn)
  const fetchWeek = useAttendanceStore((state) => state.fetchWeek)
  const getWeek = useAttendanceStore((state) => state.getWeek)

  const formatTime = (date: Date) => {
    const h = date.getHours()
    const m = date.getMinutes()
    const hour = h % 12 || 12
    const meridian = h < 12 ? 'A.M' : 'P.M'
    return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${meridian}`
  }

  const getCurrentDayName = () =>
    new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date())

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const handleCheckIn = async () => {
    if (!user) return

    if (time) {
      const confirmRepeat = confirm('Ya registraste tu entrada. ¿Deseas volver a marcar?')
      if (!confirmRepeat) return
    }

    const now = new Date()
    const hora = now.toTimeString().slice(0, 5) // HH:mm
    const fecha = now.toISOString().slice(0, 10) // yyyy-mm-dd
    const today = capitalize(getCurrentDayName())

    try {
      await postMarcajeLocal({
        empleadoId: user.id,
        tipo: 'E',
        fecha,
        hora,
      })

      markCheckIn(user.id, today, hora)
      await fetchWeek(user)

      const updated = getWeek(user.id).find((d) => d.day === today)
      if (updated?.checkIn) {
        const [h, m] = updated.checkIn.split(':').map(Number)
        const d = new Date()
        d.setHours(h, m)
        setTime(formatTime(d))
      }
    } catch (err) {
      console.error('❌ Error al registrar entrada:', err)
      alert('Hubo un error al registrar tu entrada.')
    }
  }

  useEffect(() => {
    if (!user) return
    const today = capitalize(getCurrentDayName())
    const todayData = getWeek(user.id).find((d) => d.day === today)

    if (todayData?.checkIn) {
      const [h, m] = todayData.checkIn.split(':').map(Number)
      const d = new Date()
      d.setHours(h, m)
      d.setMinutes(m)
      setTime(formatTime(d))
    }
  }, [user, getWeek])

  const isMarked = !!time

  return (
    <div
      onClick={handleCheckIn}
      className={`card-bg rounded-2xl shadow-md transition-transform p-4 cursor-pointer flex flex-col items-center justify-center h-36 w-full
        ${isMarked ? 'border-2 border-blue-500' : 'hover:ring-2 hover:ring-blue-300 hover:scale-[1.02]'}`}
    >
      <div className="flex items-center justify-between w-full text-xs font-semibold text-black dark:text-white">
        <span>CHECK-IN</span>
        <LogIn className="text-blue-500" size={16} />
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

export default CheckInCard
