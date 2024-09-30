import { Check, ClockIcon, Eye, Hourglass } from 'lucide-react'
import InputField from './InputField'
import { HTMLAttributes } from 'react'
import { cn } from '@renderer/lib/utils'
import { useClock } from '@renderer/contexts/ClockContext'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  onSubmitForm: () => void
}

export default function Form({ onSubmitForm, className, ...props }: Props): JSX.Element {
  const {
    setHours,
    useTime,
    setMinutes,
    restTime,
    setRest,
    setAutoPlay,
    setReset,
    autoPlay,
    reset
  } = useClock()

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <InputField
        id="horas"
        label="Horas"
        prefixNode={<Hourglass />}
        value={Math.trunc(useTime / 3600)}
        onChange={(event) => setHours(parseInt(event.target.value))}
      />
      <InputField
        id="minutos"
        label="Minutos"
        prefixNode={<ClockIcon />}
        value={Math.trunc(useTime % 3600) / 60}
        onChange={(event) => setMinutes(parseInt(event.target.value))}
      />
      <InputField
        id="descanso"
        label="Descanso"
        prefixNode={<Eye />}
        value={restTime}
        onChange={(event) => setRest(parseInt(event.target.value))}
      />
      <label
        htmlFor="auto-play"
        className="flex cursor-pointer items-center justify-end gap-x-2 px-2 text-lg font-medium leading-6 text-gray-300"
      >
        AutoPlay:
        <div className="relative mt-2 flex w-28 justify-center rounded-md shadow-sm">
          <input
            id="auto-play"
            type="checkbox"
            value={String(autoPlay)}
            className="peer sr-only"
            checked={autoPlay}
            onChange={(event) => setAutoPlay(event.target.value)}
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-indigo-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800"></div>
        </div>
      </label>
      <label
        htmlFor="reiniciar"
        className="flex cursor-pointer items-center justify-end gap-x-2 px-2 text-lg font-medium leading-6 text-gray-300"
      >
        Reiniciar:
        <div className="relative mt-2 flex w-28 justify-center rounded-md shadow-sm">
          <input
            id="reiniciar"
            type="checkbox"
            value={String(reset)}
            className="peer sr-only"
            checked={reset}
            onChange={(event) => setReset(event.target.value)}
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-indigo-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800"></div>
        </div>
      </label>
      <button
        className="mx-2 my-2 flex justify-center rounded-xl bg-orange-500 py-1 text-gray-700"
        onClick={() => useTime && onSubmitForm()}
      >
        <Check />
      </button>
    </div>
  )
}
