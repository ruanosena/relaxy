import { cn } from '@renderer/lib/utils'
import { HTMLAttributes, useEffect, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  attachedTime: [number]
  onFinish: () => void
  isPaused?: boolean
}

export default function Timer({
  attachedTime,
  onFinish,
  isPaused = false,
  className,
  ...props
}: Props): JSX.Element {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(attachedTime[0])
  }, [attachedTime])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (!isPaused) {
      intervalId = setInterval(() => {
        if (count > 0) {
          setCount(count - 1)
        } else {
          clearInterval(intervalId)
          onFinish()
        }
      }, 1000)
    } else {
      clearInterval(intervalId)
    }

    return function cleanup(): void {
      // executado a cada re-render
      clearInterval(intervalId)
    }
  }, [isPaused, count, onFinish])

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <h1 className="text-5xl font-semibold text-inherit">
        {Math.trunc(count / 3600)
          .toString()
          .padStart(2, '0')}
        :
        {Math.trunc((count % 3600) / 60)
          .toString()
          .padStart(2, '0')}
        :
        {Math.trunc(count % 60)
          .toString()
          .padStart(2, '0')}
      </h1>
    </div>
  )
}
