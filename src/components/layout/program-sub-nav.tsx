import { useParams, useLocation } from '@tanstack/react-router'
import { useProgramQuery } from '@/hooks/programs/use-programs-query'
import { NavList } from './nav-list'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from '@tanstack/react-router'


export function ProgramSubNav() {
    const { id } = useParams({ from: '/_authenticated/programs/$id' })
    const { data: program } = useProgramQuery(id)

    const pathname = useLocation({ select: (location) => location.pathname })

    const navItems = [
        {
            to: `/programs/${id}`,
            label: 'Home',
            exact: true,
        },
        {
            to: `/programs/${id}/meals`,
            label: 'Meals',
        },
        {
            to: `/programs/${id}/performance`,
            label: 'Performance',
        },
    ]

    return (
        <div className='flex items-center gap-2 h-6 '>
            <div className='font-semibold text-base text-foreground'>
                <Breadcrumb>
                    <BreadcrumbList className="text-base font-semibold text-foreground">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/programs">Programs</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/programs/$id" params={{ id }}>{program?.name}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <NavList
                options={navItems}
                pathname={pathname}
            />
        </div>
    )

}
