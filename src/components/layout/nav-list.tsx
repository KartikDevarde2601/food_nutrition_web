import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu'

type NavListProps = {
    options: readonly {
        to: string
        label: string
        exact?: boolean
    }[]
    pathname: string
    activeClassName?: string
}

export function NavList({ options, pathname, activeClassName = 'bg-accent text-accent-foreground' }: NavListProps) {
    return (
        <NavigationMenu className="mx-6" viewport={false}>
            <NavigationMenuList>
                {options.map(({ label, exact, ...props }) => {
                    const isActive = exact
                        ? pathname === props.to
                        : pathname === props.to || pathname.startsWith(props.to + '/')
                    return (
                        <NavigationMenuItem key={props.to}>
                            <NavigationMenuLink asChild >
                                <Link
                                    {...props}
                                    className={cn(
                                        'inline-flex h-8 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                        'disabled:pointer-events-none disabled:opacity-50',
                                        !isActive && 'hover:bg-accent hover:text-accent-foreground',
                                        isActive && activeClassName
                                    )}
                                >
                                    {label}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}