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
      <Header fixed>
        <TopNav />
      </Header>
      <div className='flex h-[100dvh] flex-col ml-6 mr-6'>
        {children ?? <Outlet />}
      </div>
    </>
  )
}
