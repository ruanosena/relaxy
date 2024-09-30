import { DEFAULT_TIMER_MINUTES_IN_SECONDS } from '@renderer/lib/constants'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface ClockContextData {
  useTime: number
  restTime: number
  setHours: (hours: number) => void
  setMinutes: (minutes: number) => void
  setRest: (seconds: number) => void
  autoPlay: boolean
  setAutoPlay: (value: string) => void
  reset: boolean
  setReset: (value: string) => void
}

const ClockContext = createContext({} as ClockContextData)

interface ClockContextProps {
  children: ReactNode
}

export function ClockProvider({ children }: ClockContextProps): JSX.Element {
  const [useTime, setUseTime] = useState(DEFAULT_TIMER_MINUTES_IN_SECONDS * 60)
  const [restTime, setRestTime] = useState(DEFAULT_TIMER_MINUTES_IN_SECONDS)
  const [reset, _setReset] = useState(true)
  const [autoPlay, _setAutoPlay] = useState(false)

  const setReset = useCallback((value: string) => {
    _setReset(value === 'true' ? false : true)
  }, [])

  const setAutoPlay = useCallback((value: string) => {
    _setAutoPlay(value === 'true' ? false : true)
  }, [])

  const maxRestTime = useCallback((time: number) => {
    setRestTime(Math.max(20, time))
  }, [])

  const setHours = useCallback(
    (hours: number) => {
      setUseTime((prevTime) => {
        const minutesSlice = prevTime % 3600
        maxRestTime(hours * 60 + Math.trunc(minutesSlice / 60))
        return hours * 3600 + minutesSlice
      })
    },
    [maxRestTime]
  )

  const setMinutes = useCallback(
    (minutes: number) => {
      setUseTime((prevTime) => {
        const hours = Math.trunc(prevTime / 3600)
        maxRestTime(hours * 60 + minutes)
        return hours * 3600 + minutes * 60
      })
    },
    [maxRestTime]
  )

  const setRest = useCallback((time: number) => setRestTime(time), [])

  return (
    <ClockContext.Provider
      value={{
        useTime,
        restTime,
        setHours,
        setMinutes,
        setRest,
        autoPlay,
        setAutoPlay,
        reset,
        setReset
      }}
    >
      {children}
    </ClockContext.Provider>
  )
}

export const useClock = (): ClockContextData => useContext(ClockContext)
