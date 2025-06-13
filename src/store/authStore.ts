import { create } from 'zustand'

type AuthState = {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
    checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,

    login: () => {
        localStorage.setItem('auth', 'true')
        set({ isAuthenticated: true })
    },

    logout: () => {
        localStorage.removeItem('auth')
        set({ isAuthenticated: false })
    },

    checkAuth: () => {
        const stored = localStorage.getItem('auth') === 'true'
        set({ isAuthenticated: stored })
    }
}))
