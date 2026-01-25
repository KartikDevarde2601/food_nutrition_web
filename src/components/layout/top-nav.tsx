import * as React from 'react'
import { useLocation, linkOptions } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { NavList } from './nav-list'

type TopNavProps = React.HTMLAttributes<HTMLElement>


const options = linkOptions([
  {
    to: '/programs',
    label: 'Programs',
  },
  {
    to: '/dishes',
    label: 'Dishes',
  },
  {
    to: '/dish_similarity',
    label: 'Dish Similarity',
  },
])

export function TopNav({ className, ...props }: TopNavProps) {

  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <>
      <nav
        className={cn(
          'hidden w-full items-center gap-2 md:flex lg:gap-6 bg-background',
          className
        )}
        {...props}
      >
        {/* Left Side: Logo and Links */}
        <div className='flex items-center ms-auto gap-4 w-full'>
          {/* Logo / Brand */}
          <div className='flex items-center gap-2 font-bold text-base shrink-0' onClick={() => window.location.href = '/cdith/nutritionscanner'} role="button" tabIndex={0}>
            <svg
              className='h-6 w-6 text-foreground'
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <div className='flex items-center gap-2 font-bold text-foreground text-lg'>Nutrition Scanner</div>
          </div>
          <div className='flex flex-row ms-auto flex-1 justify-between'>
            <NavList options={options} pathname={pathname} activeClassName="bg-secondary text-secondary-foreground ring-1 ring-border" />
            <div className='flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </div>

      </nav>

    </>
  )
}


