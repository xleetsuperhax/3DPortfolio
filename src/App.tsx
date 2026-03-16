import { CanvasWrapper } from './components/CanvasWrapper'
import { InfoPanel } from './components/InfoPanel'
import { NavHint } from './components/NavHint'
import { CameraBlockedHint } from './components/CameraBlockedHint'
import { InstructionsDialog } from './components/InstructionsDialog'
import { AboutMeDialog } from './components/AboutMeDialog'
import { InfoButton } from './components/InfoButton'
import { NavigationControls } from './components/NavigationControls'
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
      <CameraBlockedHint />
      <InfoButton />
      <InstructionsDialog />
      <AboutMeDialog />
      <NavigationControls />
    </div>
  )
}
