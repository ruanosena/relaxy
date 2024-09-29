import {
  Check,
  Clock as ClockIcon,
  Eye,
  FastForward,
  Hourglass,
  Pause,
  Play,
  Settings,
  StopCircle
} from 'lucide-react'
import InputField from './InputField'
import { Fragment, useCallback, useEffect, useState } from 'react'

interface Props {
  isOverlay: boolean
}

export default function Clock({ isOverlay }: Props): JSX.Element {
  const [isEditing, setIsEditing] = useState(true)
  const [time, setTime] = useState(20 * 60)
  const [restTime, setRestTime] = useState(20)
  const [isActive, setIsActive] = useState(false)
  // const [activeTime, setActiveTime] = useState()

  const maxRestTime = useCallback((time) => {
    setRestTime(Math.max(20, time))
  }, [])

  const setHours = useCallback(
    (hours: number) => {
      setTime((prevTime) => {
        hours = hours > 0 ? hours : 0
        const minutesSlice = prevTime % 3600
        maxRestTime(hours * 60 + Math.trunc(minutesSlice / 60))
        return hours * 3600 + minutesSlice
      })
    },
    [maxRestTime]
  )

  const setMinutes = useCallback(
    (minutes: number) => {
      setTime((prevTime) => {
        minutes = minutes > 0 ? minutes : 0
        const hours = Math.trunc(prevTime / 3600)
        maxRestTime(hours * 60 + minutes)
        return hours * 3600 + minutes * 60
      })
    },
    [maxRestTime]
  )

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (isActive) {
      intervalId = setInterval(() => {
        if (time > 0) {
          setTime(time - 1)
        } else {
          // tocar som anti android
          clearInterval(intervalId)
          setIsActive(false)
        }
      }, 1000)
    } else {
      clearInterval(intervalId)
    }

    return function cleanup(): void {
      // executado a cada re-render
      clearInterval(intervalId)
    }
  }, [isActive, time])

  return (
    <Fragment>
      {isEditing ? (
        <div className="flex flex-col">
          <InputField
            label="Horas"
            prefixNode={<Hourglass />}
            value={Math.trunc(time / 3600)}
            onChange={(event) => setHours(parseInt(event.target.value))}
          />
          <InputField
            label="Minutos"
            prefixNode={<ClockIcon />}
            value={Math.trunc(time % 3600) / 60}
            onChange={(event) => setMinutes(parseInt(event.target.value))}
          />
          <InputField
            label="Descanso"
            prefixNode={<Eye />}
            value={restTime}
            onChange={(event) => setRestTime(parseInt(event.target.value))}
          />
          <button
            className="mx-2 my-2 flex justify-center rounded-xl bg-orange-500 py-1 text-gray-700"
            onClick={() => time && setIsEditing(false)}
          >
            <Check />
          </button>
        </div>
      ) : (
        <Fragment>
          <div className="flex justify-center">
            <h1 className="text-5xl font-semibold text-indigo-400">
              {Math.trunc(time / 3600)
                .toString()
                .padStart(2, '0')}
              :
              {Math.trunc((time % 3600) / 60)
                .toString()
                .padStart(2, '0')}
              :
              {Math.trunc(time % 60)
                .toString()
                .padStart(2, '0')}
            </h1>
          </div>
          <div
            id="timer-buttons"
            className="flex justify-around bg-black/10 py-0.5 text-gray-400/65"
          >
            {isActive ? (
              <Fragment>
                <button>
                  <Pause />
                </button>
                <button>
                  <StopCircle />
                </button>
              </Fragment>
            ) : (
              <Fragment>
                <button className="p-1" onClick={() => setIsActive(true)}>
                  <Play className="size-6" />
                </button>
                <button className="p-1">
                  <FastForward className="size-6" />
                </button>
                <button className="p-1" onClick={() => setIsEditing(true)}>
                  <Settings className="size-6" />
                </button>
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
