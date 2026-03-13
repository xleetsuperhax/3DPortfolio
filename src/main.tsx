import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'

// StrictMode intentionally omitted: it double-mounts in dev, disposing the
// WebGL context between cycles and leaving the canvas blank on remount.
createRoot(document.getElementById('root')!).render(<App />)
