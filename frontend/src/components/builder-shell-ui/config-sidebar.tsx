"use client"

import * as React from "react"
import {
  Settings, Code, Database, Edit, Plus, Terminal, Trash2,
  Settings2,
  Folder,
  ChevronRight
} from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenuItem, SidebarGroup,
  SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton,
  SidebarMenu, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton // ✅ Import the sub-menu components
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" // ✅ Import Collapsible
import { Button } from '@/components/ui/button';
import { type ConfigSidebarProps } from '@/lib/config-sidebar-types'; // Adjust path
import { TechStackCircles, type TechStackItem } from "@/components/ui/tech-stack-circles"
import SvgIcon from "@/components/SvgIcon"
import { techSvgs } from "@/lib/tech-assets"
import { ButtonT } from "@/components/ButtonT"

// Import all relevant stack options
import {
  FRAMEWORKS,
  DATABASES,
  ORMS,
  VALIDATIONS,
  AUTHENTICATION_OPTIONS,
  FEATURES,
} from '@/lib/project-config'; // Assuming these are in project-config.ts or similar

// Combine all tech options for easy lookup
const allTechOptions = [
  ...FRAMEWORKS,
  ...DATABASES,
  ...ORMS,
  ...VALIDATIONS,
  ...AUTHENTICATION_OPTIONS,
  ...FEATURES,
];

// Helper to get techKey from value
const getTechKey = (value: string) => {
  const option = allTechOptions.find(opt => opt.value === value);
  return option ? option.techKey : value; // Fallback to value if no specific techKey is found
};

export function ConfigSidebar({
  projectConfig,
  selectedIds,
  onNavigate,
  onAddModel,
  onEditModel,
  onAddResource,
  onAddEndpoint,
  onSelectEndpoint,
  onRequestDelete,
  ...props
}: ConfigSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const { stack, models, resources } = projectConfig;

  const coreStackItems: TechStackItem[] = [];
  const featureItems: TechStackItem[] = [];

  // Core Stack: framework, database, orm, validation
  if (stack.framework) {
    coreStackItems.push({
      id: stack.framework,
      name: stack.framework,
      icon: <SvgIcon svgString={techSvgs[getTechKey(stack.framework)] || ''} className="h-5 w-5" />,
    });
  }

  if (stack.database) {
    coreStackItems.push({
      id: stack.database,
      name: stack.database,
      icon: <SvgIcon svgString={techSvgs[getTechKey(stack.database)] || ''} className="h-5 w-5" />,
    });
  }

  if (stack.orm) {
    coreStackItems.push({
      id: stack.orm,
      name: stack.orm,
      icon: <SvgIcon svgString={techSvgs[getTechKey(stack.orm)] || ''} className="h-5 w-5" />,
    });
  }

  if (stack.validation && stack.validation !== 'framework-specific') {
    coreStackItems.push({
      id: stack.validation,
      name: stack.validation,
      icon: <SvgIcon svgString={techSvgs[getTechKey(stack.validation)] || ''} className="h-5 w-5" />,
    });
  }

  if (stack.authentication && stack.authentication !== 'none') {
    coreStackItems.push({
      id: stack.authentication,
      name: stack.authentication,
      icon: <SvgIcon svgString={techSvgs[getTechKey(stack.authentication)] || ''} className="h-5 w-5" />,
    });
   
  }

  if (stack.features && stack.features.length > 0) {
    stack.features.forEach(feature => {
      featureItems.push({
        id: feature,
        name: feature,
        icon: <SvgIcon svgString={techSvgs[getTechKey(feature)] || ''} className="h-5 w-5" />,
      });
    });
  }
  
  return (
    <Sidebar className="top-14 !h-[calc(100svh-56px)]" {...props}>
      <SidebarHeader className="list-none">
        <SidebarMenuItem>
          <SidebarMenuButton disabled size="lg" asChild>
            <div>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Terminal className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{projectConfig.projectName|| 'Project Name'}</span>
                <p className="truncate text-foreground/70 text-xs">{projectConfig.projectDescription|| 'Project Description'}</p>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core Stack</SidebarGroupLabel>
          <SidebarGroupAction asChild title="Edit Stack">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => onNavigate('stack')}>
              <Edit className="size-3.5" /><span className="sr-only">Edit Stack</span>
            </Button>
          </SidebarGroupAction>
          <SidebarGroupContent className="list-none">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onNavigate('stack')} className="h-auto py-1">
                <TechStackCircles items={coreStackItems} overlap={3} size="md" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>

        {featureItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Additional Features</SidebarGroupLabel>
            <SidebarGroupContent className="list-none">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onNavigate('stack')} className="h-auto py-1">
                  <TechStackCircles items={featureItems} overlap={2} size="sm" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Data Models</SidebarGroupLabel>
          <SidebarGroupAction asChild title="Add Model">
            <Button variant="ghost" size="icon" className="size-7" onClick={onAddModel}>
              <Plus className="size-3.5" /><span className="sr-only">Add Model</span>
            </Button>
          </SidebarGroupAction>
          <SidebarGroupContent className="list-none">
            {/* <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onNavigate('models')} className="h-auto py-1.5">
                <Code className="size-4" />
                <span>Schema Graph</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
            {models.map(model => (
              <SidebarMenuItem key={model.id}>
                <SidebarMenuButton onClick={() => onEditModel(model.id)} className="group h-auto py-1.5">
                  <Database className="size-4" />
                  <span className="flex-1">{model.name}</span>
                  <Edit className="size-3.5" />
                  <ButtonT
                    buttonProps={{
                      size: "icon",
                      variant: "ghost",
                      className: "size-6",
                      onClick: (e) => {
                        e.stopPropagation(); // Prevent the edit action
                        onRequestDelete({ type: 'model', id: model.id, name: model.name });
                      },
                      children: <Trash2 className="size-3.5 text-destructive" />
                    }}
                    tooltipProps={{
                      content: `Delete ${model.name}`,
                      side: "right",
                      align: "center",
                    }}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
        <SidebarGroupLabel>API Resources</SidebarGroupLabel>
          <SidebarGroupAction asChild title="Add API Resource">
            <Button variant="ghost" size="icon" className="size-7" onClick={onAddResource}>
              <Plus className="size-3.5" />
            </Button>
          </SidebarGroupAction>
          <SidebarGroupContent className="list-none">
            <SidebarMenu>
              {(resources || []).map(resource => (
                <Collapsible key={resource.id} asChild defaultOpen>
                  <SidebarMenuItem>
                    <div className="flex items-center w-full">
                      {/* Main button for the resource itself */}
                      <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => onSelectEndpoint(resource.id, null)} // Selects the resource, but no endpoint
                        // variant={selectedIds.resourceId === resource.id && !selectedIds.endpointId ? "primary" : "secondary"}
                        className="flex-1 group"
                      >
                        <Folder className="size-4" />
                        <span className="flex-1">{resource.name}</span>
                        
                      </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <ButtonT
                          buttonProps={{ 
                            size: "icon", 
                            variant: "ghost", 
                            className: "size-6 opacity-0 group-hover:opacity-100",
                            onClick: (e) => { e.stopPropagation(); onRequestDelete({ type: 'resource', id: resource.id, name: resource.name })},
                            children: <Trash2 className="size-3.5 text-destructive" /> ,
                          }}
                          tooltipProps={{ content: `Delete ${resource.name}` }}
                        />
                    
                    </div>

                    {/* Collapsible content with the sub-menu */}
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {resource.endpoints.map(ep => (
                          <SidebarMenuSubItem key={ep.id}>
                            <SidebarMenuSubButton
                                onClick={() => onSelectEndpoint(resource.id, ep.id)}
                                // variant={selectedIds.endpointId === ep.id ? "primary" : "secondary"}
                                className="group"
                            >
                                <span className={`font-mono text-xs font-bold w-12 text-center rounded-sm mr-2 py-0.5 http-${ep.method.toLowerCase()}`}>{ep.method}</span>
                                <span className="flex-1 text-xs truncate">{ep.path}</span>
                                <ButtonT
                                    buttonProps={{ 
                                      size: "icon", 
                                      variant: "ghost", 
                                      className: "size-6",
                                      onClick: (e) => { e.stopPropagation(); onRequestDelete({ type: 'endpoint', id: ep.id, name: ep.path }) },
                                      children: <Trash2 className="size-3.5 text-destructive" />
                                    }}
                                    tooltipProps={{ content: `Delete ${ep.path}`}}
                                />
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                         <SidebarMenuSubItem>
                           <Button variant="ghost" size="sm" className="w-full h-8 justify-start text-muted-foreground" onClick={() => onAddEndpoint(resource.id)}>
                                <Plus className="w-4 h-4 mr-2"/> Add Endpoint
                            </Button>
                         </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}