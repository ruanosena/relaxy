import { cn } from '@renderer/lib/utils'
import { CircleX, SquareMinus } from 'lucide-react'
import { HTMLAttributes, useCallback } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function FrameBar({ className, ...props }: Props): JSX.Element {
  const handleMinimize = useCallback(() => {
    window.electron.ipcRenderer.send('minimize-window')
  }, [])
  const handleClose = useCallback(() => {
    window.electron.ipcRenderer.send('close-window')
  }, [])

  return (
    <div className={cn('flex h-6 w-screen rounded-t-xl bg-orange-300', className)} {...props}>
      <div style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} className="flex-1"></div>
      <div id="control-buttons" className="w-12 text-gray-700/65">
        <button className="size-6" onClick={handleMinimize}>
          <SquareMinus />
        </button>
        <button className="size-6" onClick={handleClose}>
          <CircleX />
        </button>
      </div>
    </div>
  )
}
