import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { FoodProvider } from './context/FoodContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <FoodProvider>
        <App />
      </FoodProvider>
    </Router>
  </StrictMode>,
)
