import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminProvider } from './context/AdminContext'
import { MenuProvider } from './context/MenuContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <MenuProvider>
        <App />
      </MenuProvider>
    </AdminProvider>
  </StrictMode>,
)
