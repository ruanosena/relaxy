import { FastForward, Pause, Play, Settings, Square } from 'lucide-react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import ding from '../assets/sounds/ding-sound.mp3'
import dong from '../assets/sounds/dong-sound.mp3'
import { cn } from '@renderer/lib/utils'
import Timer from './Timer'
import Form from './Form'
import { useClock } from '@renderer/contexts/ClockContext'

interface Props {
  isOverlay: boolean
}

export default function Clock({ isOverlay }: Props): JSX.Element {
  const [isEditing, setIsEditing] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const { useTime, restTime, autoPlay, reset } = useClock()
  const [activeTime, setActiveTime] = useState<[number]>([useTime])
  const [used, setUsed] = useState(false)
  const [rested, setRested] = useState(false)
  const dingSound = useRef(new Audio(ding))
  const dongSound = useRef(new Audio(dong))

  const handleFinishCount = useCallback(() => {
    if (activeTime[0]) {
      if (!used) {
        dingSound.current.play()
        setUsed(true)
        setActiveTime([restTime])
        !autoPlay && setIsActive(false)
      } else if (!rested) {
        dongSound.current.play()
        if (reset) {
          setActiveTime([useTime])
          setUsed(false)
        } else {
          setActiveTime([0])
          setRested(true)
        }
        !autoPlay && setIsActive(false)
      }
    }
  }, [used, rested, restTime, useTime, activeTime])

  const handleStopCount = useCallback(() => {
    if (isActive) {
      if (!used) {
        setActiveTime([useTime])
      } else if (!rested) {
        setActiveTime([restTime])
      }
      setIsActive(false)
    }
  }, [useTime, used, restTime, rested, isActive])

  const handleSubmitForm = useCallback(() => {
    setIsEditing(false)
    setUsed(false)
    setRested(false)
    setActiveTime([useTime])
  }, [useTime])

  const handlePlayPause = useCallback(() => {
    activeTime && setIsActive((active) => !active)
  }, [activeTime])

  useEffect(() => {
    window.electron.ipcRenderer.on('play-pause', handlePlayPause)
    window.electron.ipcRenderer.on('advance', handleFinishCount)
    window.electron.ipcRenderer.on('stop', handleStopCount)

    return function cleanup(): void {
      window.electron.ipcRenderer.removeAllListeners('play-pause')
      window.electron.ipcRenderer.removeAllListeners('advance')
      window.electron.ipcRenderer.removeAllListeners('stop')
    }
  }, [handlePlayPause, handleFinishCount, handleStopCount])

  return (
    <Fragment>
      {isEditing ? (
        <Form onSubmitForm={handleSubmitForm} />
      ) : (
        <Fragment>
          <Timer
            className={cn({
              'text-indigo-400': !!activeTime && !used,
              'text-orange-400': !!activeTime && used && !rested
            })}
            attachedTime={activeTime}
            onFinish={handleFinishCount}
            isPaused={!isActive}
          />

          <div
            id="clock-buttons"
            className={cn('flex justify-around bg-black/10 py-0.5 text-gray-400/65', {
              hidden: isOverlay
            })}
          >
            {isActive ? (
              <Fragment>
                <button title="Pausar" className="p-1" onClick={handlePlayPause}>
                  <Pause className="size-6 text-yellow-200" />
                </button>
                <button title="Parar" className="p-1" onClick={handleStopCount}>
                  <Square className="size-6 text-red-300" />
                </button>
              </Fragment>
            ) : (
              <Fragment>
                <button title="Configurar" className="p-1" onClick={() => setIsEditing(true)}>
                  <Settings className={cn('size-6', { 'text-white/80': !activeTime })} />
                </button>
                <button title="Play" className="p-1" onClick={handlePlayPause}>
                  <Play className={cn('size-6', { 'text-green-300': !!activeTime })} />
                </button>
                <button title="Avançar" className="p-1" onClick={handleFinishCount}>
                  <FastForward className={cn('size-6', { 'text-orange-300': !!activeTime })} />
                </button>
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
