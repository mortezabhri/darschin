import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

registerSW({
       Immediate: true
})

createRoot(document.getElementById('root')).render(
       <BrowserRouter
              basename='/darschin'
       >
              <App />
       </BrowserRouter>
)
