import { Check, ClockIcon, Eye, Hourglass } from 'lucide-react'
import InputField from './InputField'
import { HTMLAttributes } from 'react'
import { cn } from '@renderer/lib/utils'
import { useClock } from '@renderer/contexts/ClockContext'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  onSubmitForm: () => void
}

export default function Form({ onSubmitForm, className, ...props }: Props): JSX.Element {
  const { setHours, useTime, setMinutes, restTime, setRest } = useClock()

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <InputField
        label="Horas"
        prefixNode={<Hourglass />}
        value={Math.trunc(useTime / 3600)}
        onChange={(event) => setHours(parseInt(event.target.value))}
      />
      <InputField
        label="Minutos"
        prefixNode={<ClockIcon />}
        value={Math.trunc(useTime % 3600) / 60}
        onChange={(event) => setMinutes(parseInt(event.target.value))}
      />
      <InputField
        label="Descanso"
        prefixNode={<Eye />}
        value={restTime}
        onChange={(event) => setRest(parseInt(event.target.value))}
      />
      <button
        className="mx-2 my-2 flex justify-center rounded-xl bg-orange-500 py-1 text-gray-700"
        onClick={() => useTime && onSubmitForm()}
      >
        <Check />
      </button>
    </div>
  )
}
