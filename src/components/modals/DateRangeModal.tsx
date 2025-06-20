// components/modals/DateRangeModal.tsx
import { useEffect } from 'react'
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
  const handleRangeChange = (ranges: any) => {
    const start = ranges.selection.startDate
    const end = ranges.selection.endDate
    const format = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    const rangeText = `del ${format(start)} al ${format(end)}`
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
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <DateRange
          editableDateInputs
          moveRangeOnFirstSelection={false}
          ranges={[
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection',
            },
          ]}
          onChange={handleRangeChange}
          locale={es}
        />
      </div>
    </div>
  )
}

export default DateRangeModal
