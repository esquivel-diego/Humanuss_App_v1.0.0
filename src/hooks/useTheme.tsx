import { useEffect, useState } from 'react'

export const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        const resolvedTheme = stored ?? (prefersDark ? 'dark' : 'light')
        setTheme(resolvedTheme)
        document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    return { theme, toggleTheme }
}
