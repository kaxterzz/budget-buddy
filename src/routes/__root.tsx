import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Navbar } from '@/components/Navbar.tsx'
import { Footer } from '@/components/footer'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
      <Footer/>
    </div>
  ),
})
