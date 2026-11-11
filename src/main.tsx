import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/young-serif/400.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import './styles/variables.css'
import './styles/main.css'
import App from './App'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
