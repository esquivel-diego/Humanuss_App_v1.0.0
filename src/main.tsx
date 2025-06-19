import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { useMoodStore } from './store/moodStore'
useMoodStore.getState().checkMoodStatus()


const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
