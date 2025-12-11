import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

type TopNavProps = React.HTMLAttributes<HTMLElement>

const defaultLinks = [
  { title: 'Programs', href: '/programs' },
  { title: 'Dishes', href: '/dishes' },
  { title: 'Dish Similarity', href: '/dishes/similarity/' },
]

export function TopNav({ className, ...props }: TopNavProps) {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Mobile Menu */}
      <div className='md:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline' className='md:size-7'>
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {defaultLinks.map(({ title, href }) => (
              <DropdownMenuItem key={`${title}-${href}`}>
                <Link
                  to={href}
                  className='w-full'
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden w-full items-center gap-4 md:flex lg:gap-10',
          className
        )}
        {...props}
      >
        {/* Left Side: Logo and Links */}
        <div className='flex items-center ms-auto min-w-200 gap-6 w-full'>
          {/* Logo / Brand */}
          <div className='flex items-center gap-2 font-bold text-lg'>
            <img
              src='/images/favicon.svg'
              alt='Nutrition Scanner'
              className='h-8 w-8'
            />
            <span>Nutrition Scanner</span>
          </div>

          <div className='flex flex-row ms-auto w-full justify-between'>
            {/* Center: Navigation Menu */}
            <div className='flex'>
              <NavigationMenu viewport={!isMobile}>
                <NavigationMenuList>
                  {defaultLinks.map((link) => (
                    <NavigationMenuItem key={link.title}>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to={link.href} activeProps={{ className: '!text-primary' }} className='bg-transparent'>
                          {link.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

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

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string; href: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
