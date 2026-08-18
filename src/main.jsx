import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './motion.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'

// Recover once when an open tab still references a chunk removed by a newer deploy.
const PRELOAD_RELOAD_KEY = 'gatrivi_preload_reload_at'

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()

  try {
    const lastReload = Number(sessionStorage.getItem(PRELOAD_RELOAD_KEY) || 0)
    const now = Date.now()
    if (now - lastReload < 10_000) return
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(now))
  } catch {
    /* reload anyway when storage is unavailable */
  }

  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
