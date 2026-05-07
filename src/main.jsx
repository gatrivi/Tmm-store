import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminProvider } from './context/AdminContext'
import { MenuProvider } from './context/MenuContext'
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <MenuProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </MenuProvider>
    </AdminProvider>
  </StrictMode>,
)
