import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FoerderungPage } from './pages/FoerderungPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FoerderungPage />
  </StrictMode>,
)
