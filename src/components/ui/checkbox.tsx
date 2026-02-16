import * as React from 'react'
import { CheckIcon, MinusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define props for the native checkbox
interface NativeCheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'onChange'
  > {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
  'aria-invalid'?: boolean // Explicitly add aria-invalid for clarity
}

function Checkbox({
  className,
  checked,
  onCheckedChange,
  id,
  'aria-invalid': ariaInvalid,
  disabled, // Destructure disabled prop
  ...props
}: NativeCheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id || generatedId
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sync the "indeterminate" state to the native input element
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = checked === 'indeterminate'
    }
  }, [checked])

  const isChecked = checked === true
  const isIndeterminate = checked === 'indeterminate'

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center', // Wrapper for positioning and overall class
        className
      )}
    >
      <input
        ref={inputRef}
        type='checkbox'
        id={checkboxId}
        checked={isChecked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className='peer absolute top-0 left-0 z-10 size-full cursor-pointer opacity-0' // Hidden native checkbox, z-index for clickability
        aria-invalid={ariaInvalid}
        disabled={disabled}
        {...props}
      />
      {/* Visual representation of the checkbox */}
      <div
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none',
          'border-input dark:bg-input/30',
          isChecked || isIndeterminate
            ? 'bg-primary text-primary-foreground border-primary dark:bg-primary'
            : '',
          'peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]',
          ariaInvalid
            ? 'ring-destructive/20 dark:ring-destructive/40 border-destructive'
            : '',
          disabled ? 'cursor-not-allowed opacity-50' : ''
        )}
      >
        {isChecked && <CheckIcon className='size-3.5' />}
        {isIndeterminate && <MinusIcon className='size-3.5' />}
      </div>
    </div>
  )
}

export { Checkbox }
