"use client"

import { Home, SidebarIcon } from "lucide-react"
import { Link } from "react-router-dom";
import { SearchForm } from '@/components/dashboard-ui/search-form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { UserButton, useUser } from "@stackframe/react"
import { ModeToggle } from "@/components/mode-toggle"
import { LineShadowText } from "@/components/ui/line-shadow-text";

export function SiteHeader() {
  const user = useUser({ or: 'redirect'})
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-14 w-full items-center gap-4 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors">
            <LineShadowText className="italic">Tourify</LineShadowText>
          </Link>
        </div>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        <ModeToggle />
        <UserButton />
      </div>
    </header>
  )
}
