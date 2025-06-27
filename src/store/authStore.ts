// src/store/authStore.ts
import { create } from 'zustand'
import type { User } from '@services/authService'

type AuthStore = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const loadInitialUser = (): User | null => {
  try {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: loadInitialUser(),

  login: (user) => {
    localStorage.setItem('authUser', JSON.stringify(user))
    localStorage.setItem('TOKENLOG', user.token)
    localStorage.setItem('USUARIOLOG', JSON.stringify(user)) // ✅ formato correcto
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('authUser')
    localStorage.removeItem('TOKENLOG')
    localStorage.removeItem('USUARIOLOG')
    set({ user: null })
  }
}))
