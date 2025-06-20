// src/store/newsStore.ts
import { create } from 'zustand'

export type NewsItem = {
  id: number
  title: string
  content: string
  date: string
}

type NewsStore = {
  news: NewsItem[]
  addNews: (item: Omit<NewsItem, 'id' | 'date'>) => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'news_feed'

export const useNewsStore = create<NewsStore>((set) => ({
  news: [],

  addNews: (item) => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const existing: NewsItem[] = stored ? JSON.parse(stored) : []
    const newItem: NewsItem = {
      ...item,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    const updated = [...existing, newItem]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ news: updated })
  },

  loadFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      set({ news: JSON.parse(raw) })
    }
  },
}))
