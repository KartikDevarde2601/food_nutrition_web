import { Outlet } from '@tanstack/react-router'
import { SkipToMain } from '@/components/skip-to-main'
import { Header } from './header'
import { TopNav } from './top-nav'



type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <>
      <SkipToMain />
      <Header fixed className='bg-background'>
        <TopNav />
      </Header>

      <div className='flex h-[100dvh] flex-col'>
        {children ?? <Outlet />}
      </div>
    </>
  )
}
