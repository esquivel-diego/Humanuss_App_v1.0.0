import { useEffect, useState } from 'react'
import { DateRange } from 'react-date-range'
import { es } from 'date-fns/locale'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import '../../styles/calendar.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectRange: (rangeText: string) => void
  /**
   * Opcional: si se provee, emitirá también las fechas inicio/fin en YYYY-MM-DD (local).
   */
  onSelectRangeDetailed?: (args: { start: string; end: string; label: string }) => void
}

const toLocalYMD = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const DateRangeModal = ({ isOpen, onClose, onSelectRange, onSelectRangeDetailed }: Props) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  const handleRangeChange = (ranges: any) => {
    const selection = ranges.selection
    setSelectionRange(selection)
  }

  const handleApply = () => {
    const { startDate, endDate } = selectionRange
    const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    const label = `del ${fmt(startDate)} al ${fmt(endDate)}`
    onSelectRange(label)

    if (onSelectRangeDetailed) {
      onSelectRangeDetailed({
        start: toLocalYMD(startDate),
        end: toLocalYMD(endDate),
        label,
      })
    }

    onClose()
  }

  useEffect(() => {
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEsc)
    return () => document.removeEventListener('keydown', closeOnEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
        <DateRange
          editableDateInputs
          moveRangeOnFirstSelection={false}
          ranges={[selectionRange]}
          onChange={handleRangeChange}
          locale={es}
        />

        <div className="flex justify-end">
          <button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateRangeModal
