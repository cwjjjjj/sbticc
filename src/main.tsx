import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Domain redirect
if (window.location.hostname === 'sbticc.vercel.app') {
  window.location.replace(
    'https://sbti.jiligulu.xyz' + window.location.pathname + window.location.search + window.location.hash
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
