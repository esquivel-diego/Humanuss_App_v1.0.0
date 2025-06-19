import { create } from 'zustand'

type User = {
  id: number
  name: string
  role: 'admin' | 'employee'
}

type AuthStore = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('authUser') || 'null'),
  login: (user) => {
    localStorage.setItem('authUser', JSON.stringify(user))
    set({ user })
  },
  logout: () => {
    localStorage.removeItem('authUser')
    set({ user: null })
  }
}))
