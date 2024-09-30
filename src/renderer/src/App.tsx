import FrameBar from './components/FrameBar'
import { useEffect, useState } from 'react'
import Clock from './components/Clock'
import { cn } from './lib/utils'
import { ClockProvider } from './contexts/ClockContext'

function App(): JSX.Element {
  const [isOverlay, setIsOverlay] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('overlay-mode', () => {
      setIsOverlay((prevState) => !prevState)
    })

    return function cleanup(): void {
      window.electron.ipcRenderer.removeAllListeners('overlay-mode')
    }
  }, [])

  return (
    <ClockProvider>
      <FrameBar className={cn({ invisible: isOverlay })} />
      <div
        className={cn(
          'overflow-hidden bg-black/40',
          { 'pt-2': !isOverlay },
          isOverlay ? 'rounded-xl' : 'rounded-b-xl'
        )}
      >
        <Clock isOverlay={isOverlay} />
      </div>
    </ClockProvider>
  )
}

export default App
