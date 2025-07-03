import { AppSidebar } from '@/components/dashboard-ui/app-sidebar'
import { SiteHeader } from '@/pages/dashboard/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'
import { useUser } from '@stackframe/react'

export default function DashboardLayout() {
  // Protect all routes under this layout
  useUser({ or: "redirect" });

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider className="flex flex-col flex-1">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
