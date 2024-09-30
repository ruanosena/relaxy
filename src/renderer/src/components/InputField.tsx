import { InputHTMLAttributes, ReactNode, useCallback } from 'react'
import { cn } from '@renderer/lib/utils'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  prefixNode?: ReactNode
}

export default function InputField({
  id,
  label,
  className,
  prefixNode,
  onChange,
  ...props
}: Props): JSX.Element {
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value)) {
      onChange && onChange(event)
    }
  }, [])

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-baseline justify-end gap-x-2 px-2 text-lg font-medium leading-6 text-gray-300"
    >
      {label}:
      <div className="relative mt-2 rounded-md shadow-sm">
        {prefixNode && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <span className="text-gray-700/65">{prefixNode}</span>
          </div>
        )}
        <input
          type="number"
          id={id}
          className={cn(
            'block w-28 rounded-md border-0 bg-gray-400 py-1.5 pl-10 pr-1.5 text-xl font-semibold text-indigo-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
            className
          )}
          {...props}
          onChange={handleInputChange}
        />
      </div>
    </label>
  )
}
