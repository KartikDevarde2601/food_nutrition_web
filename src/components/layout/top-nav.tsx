import * as React from 'react'
import { Link, useLocation, linkOptions } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'


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
          'hidden w-full items-center gap-4 md:flex lg:gap-10',
          className
        )}
        {...props}
      >
        {/* Left Side: Logo and Links */}
        <div className='flex items-center ms-auto gap-6 w-full'>
          {/* Logo / Brand */}
          <div className='flex items-center gap-2 font-bold text-lg shrink-0'>
            <img
              src='/images/favicon.svg'
              alt='Nutrition Scanner'
              className='h-8 w-8'
            />
            <div className='flex items-center gap-2 font-bold text-lg'>Nutrition Scanner</div>
          </div>

          <div className='flex flex-row ms-auto flex-1 justify-between'>
            {/* Center: Navigation Menu */}
            <NavigationMenu className="mx-6">
              <NavigationMenuList>
                {options.map((option) => {
                  const isActive =
                    pathname === option.to || pathname.startsWith(option.to + '/')
                  return (
                    <NavigationMenuItem key={option.to} >
                      <NavigationMenuLink asChild active={isActive}>
                        <Link
                          {...option}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            'bg-transparent',
                            isActive && 'bg-accent text-accent-foreground underline'
                          )}
                        >
                          {option.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Side: Theme & Profile */}
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


