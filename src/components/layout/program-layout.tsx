
import { Outlet } from '@tanstack/react-router'
import { Header } from './header'
import { ProgramSubNav } from './program-sub-nav'



type ProgramLayoutProps = {
    children?: React.ReactNode
}

export function ProgramLayout({ children }: ProgramLayoutProps) {
    return (
        <>
            <Header fixed className="top-12 bg-background">
                <ProgramSubNav />
            </Header>
            <div className='flex h-full flex-col top-36 mt-14 '>
                {children ?? <Outlet />}
            </div>
        </>
    )
}