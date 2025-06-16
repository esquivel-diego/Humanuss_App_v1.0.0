import { useState } from 'react'
import { useMoodStore } from '../store/moodStore'

type MoodOption = {
  label: string
  value: 'happy' | 'neutral' | 'sad' | 'angry'
  emoji: string
  bg: string
}

const options: MoodOption[] = [
  { label: 'Triste', value: 'sad', emoji: '😟', bg: 'bg-[#a0aec0]' },
  { label: 'Neutral', value: 'neutral', emoji: '😐', bg: 'bg-[#f6c948]' },
  { label: 'Feliz', value: 'happy', emoji: '😊', bg: 'bg-[#f687b3]' },
  { label: 'Molesto', value: 'angry', emoji: '😠', bg: 'bg-[#68d391]' },
]

export default function MoodModal() {
  const { hasSubmittedToday, submitMood } = useMoodStore()
  const [selected, setSelected] = useState<'happy' | 'neutral' | 'sad' | 'angry' | null>(null)
  const [sent, setSent] = useState(false)

  if (hasSubmittedToday || sent) return null

  const handleSubmit = () => {
    if (selected) {
      submitMood(selected)
      setSent(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/60 dark:bg-[#1e1e1e]/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-xs w-full border border-white/30">
        <h3 className="text-center text-lg font-semibold mb-6 text-gray-800 dark:text-white">
          ¿Cómo te sientes hoy?
        </h3>

        <div className="flex justify-between gap-2 mb-6">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center shadow-sm transition-all border border-transparent
                ${opt.bg}
                ${selected === opt.value ? 'ring-4 ring-blue-500 scale-105' : 'opacity-80 hover:opacity-100'}`}
            >
              {opt.emoji}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          ENVIAR
        </button>
      </div>
    </div>
  )
}
