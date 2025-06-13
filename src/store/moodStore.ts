import { create } from 'zustand'

type Mood = 'happy' | 'neutral' | 'sad' | 'angry'

type MoodStore = {
    hasSubmittedToday: boolean
    mood: Mood | null
    submitMood: (mood: Mood) => void
    checkMoodStatus: () => void
}

export const useMoodStore = create<MoodStore>((set) => ({
    hasSubmittedToday: false,
    mood: null,

    submitMood: (mood) => {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem('moodDate', today)
        localStorage.setItem('moodValue', mood)
        set({ hasSubmittedToday: true, mood })
    },

    checkMoodStatus: () => {
        const today = new Date().toISOString().split('T')[0]
        const storedDate = localStorage.getItem('moodDate')
        const storedMood = localStorage.getItem('moodValue') as Mood | null

        set({
            hasSubmittedToday: storedDate === today,
            mood: storedMood,
        })
    },
}))
