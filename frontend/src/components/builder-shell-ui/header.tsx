"use client"

import { Home, SidebarIcon } from "lucide-react"
import { useState } from "react"
import { SearchForm } from '@/components/dashboard-ui/search-form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { UserButton } from "@stackframe/react"
import { ModeToggle } from "@/components/mode-toggle"
import { ProjectSwitcher } from "@/components/builder-shell-ui/project-switcher";
// mock-data.ts

export interface MockProject {
  id: string;
  name: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: 'proj_1a2b3c', name: 'SaaS Platform API' },
  { id: 'proj_4d5e6f', name: 'E-commerce Backend' },
  { id: 'proj_7g8h9i', name: 'Internal Admin Tool' },
  { id: 'proj_j1k2l3', name: 'Mobile App Gateway' },
];

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const [currentProjectId, setCurrentProjectId] = useState(MOCK_PROJECTS[0].id);


  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    // In the future, this is where you would trigger a data fetch for the new project.
    // e.g., `router.push(`/builder/${projectId}`)` or `fetchProjectConfig(projectId)`
    console.log("Switched to project:", projectId);
  };

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
        <ProjectSwitcher
          projects={MOCK_PROJECTS}
          currentProjectId={currentProjectId}
          onSelectProject={handleSelectProject}
        />
        <div className="ml-auto flex items-center gap-2">
            <SearchForm className="w-full sm:w-auto" />
            <ModeToggle />
            <UserButton />
        </div>
      </div>
    </header>
  )
}
