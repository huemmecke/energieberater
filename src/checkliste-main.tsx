import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChecklistPage } from './pages/ChecklistPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChecklistPage />
  </StrictMode>,
)
