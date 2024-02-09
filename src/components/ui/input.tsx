import { cn, mergeRefs } from '@/lib/utils'
import { forwardRef, useEffect, useRef } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnterKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  focusOnMount?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onEnterKeyDown, focusOnMount, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (focusOnMount && internalRef.current) {
        internalRef.current.focus()
      }
    }, [focusOnMount])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      props.onKeyDown?.(event)

      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
      ) {
        onEnterKeyDown?.(event)
      }
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
          className,
        )}
        ref={mergeRefs([internalRef, ref])}
        {...props}
        onKeyDown={handleKeyDown}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
