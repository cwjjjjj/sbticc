import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Domain redirect
if (window.location.hostname === 'sbticc.vercel.app') {
  window.location.replace(
    'https://test.jiligulu.xyz' + window.location.pathname + window.location.search + window.location.hash
  )
}

// Load vConsole on test domains for mobile debugging
if (window.location.hostname.includes('sbticc-test')) {
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js'
  script.onload = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (window as any).VConsole()
  }
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
