import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SeasonProvider } from './context/SeasonContext.jsx'
import { TimeProvider } from './context/TimeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SeasonProvider>
      <TimeProvider>
        <App />
      </TimeProvider>
    </SeasonProvider>
  </React.StrictMode>
)
