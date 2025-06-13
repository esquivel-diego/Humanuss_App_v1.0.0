import { useState } from 'react'
import { useMoodStore } from '../store/moodStore'

type MoodOption = {
    label: string
    value: 'happy' | 'neutral' | 'sad' | 'angry'
    emoji: string
}

const options: MoodOption[] = [
    { label: 'Feliz', value: 'happy', emoji: '😊' },
    { label: 'Neutral', value: 'neutral', emoji: '😐' },
    { label: 'Triste', value: 'sad', emoji: '😟' },
    { label: 'Molesto', value: 'angry', emoji: '😠' },
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4 dark:text-white">¿Cómo te sientes hoy?</h3>
                <div className="flex justify-around mb-4">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSelected(opt.value)}
                            className={`text-3xl transition-all ${selected === opt.value ? 'scale-125' : 'opacity-60'
                                }`}
                        >
                            {opt.emoji}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Enviar
                </button>
            </div>
        </div>
    )
}
