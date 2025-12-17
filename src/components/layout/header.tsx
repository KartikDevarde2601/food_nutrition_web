import { cn } from '@/lib/utils'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'z-50 h-12 border-b',
        fixed && 'header-fixed peer/header fixed top-0 left-0 right-0 bg-white',
        className
      )}

      {...props}
    >
      <div
        className={cn(
          'flex h-full items-center gap-2 px-5 sm:gap-4',
        )}
      >
        {children}
      </div>
    </header>
  )
}
