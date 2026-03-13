import { CanvasWrapper } from './components/CanvasWrapper'
import { InfoPanel } from './components/InfoPanel'
import { NavHint } from './components/NavHint'
import config from './config/projects'

export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: config.gallery.backgroundColor,
      }}
    >
      <CanvasWrapper config={config} />
      <InfoPanel config={config} />
      <NavHint />
    </div>
  )
}
