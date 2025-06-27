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
}

const DateRangeModal = ({ isOpen, onClose, onSelectRange }: Props) => {
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
    const format = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    const rangeText = `del ${format(startDate)} al ${format(endDate)}`
    onSelectRange(rangeText)
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
