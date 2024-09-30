import { FastForward, Pause, Play, Settings, Square } from 'lucide-react'
import { Fragment, useCallback, useRef, useState } from 'react'
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
  const [activeTime, setActiveTime] = useState(useTime)
  const [used, setUsed] = useState(false)
  const [rested, setRested] = useState(false)
  const dingSound = useRef(new Audio(ding))
  const dongSound = useRef(new Audio(dong))

  const handleFinishCount = useCallback(() => {
    if (!used) {
      dingSound.current.play()
      setUsed(true)
      setActiveTime(restTime)
      !autoPlay && setIsActive(false)
    } else if (!rested) {
      dongSound.current.play()
      if (reset) {
        setActiveTime(useTime)
        setUsed(false)
      } else {
        setActiveTime(0)
        setRested(true)
      }
      !autoPlay && setIsActive(false)
    }
  }, [used, rested, restTime, useTime])

  const handleSubmitForm = useCallback(() => {
    setIsEditing(false)
    setUsed(false)
    setRested(false)
    setActiveTime(useTime)
  }, [useTime])

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
                <button title="Pausar" className="p-1" onClick={() => setIsActive(false)}>
                  <Pause className="size-6 text-yellow-200" />
                </button>
                <button
                  title="Encerrar"
                  className="p-1"
                  onClick={() => {
                    setIsActive(false)
                    setActiveTime(0)
                    dongSound.current.play()
                  }}
                >
                  <Square className="size-6 text-red-300" />
                </button>
              </Fragment>
            ) : (
              <Fragment>
                <button title="Configurar" className="p-1" onClick={() => setIsEditing(true)}>
                  <Settings className={cn('size-6', { 'text-white/80': !activeTime })} />
                </button>
                <button
                  title="Play"
                  className="p-1"
                  onClick={() => activeTime && setIsActive(true)}
                >
                  <Play className={cn('size-6', { 'text-green-300': !!activeTime })} />
                </button>
                <button
                  title="Avançar"
                  className="p-1"
                  onClick={() => activeTime && handleFinishCount()}
                >
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
