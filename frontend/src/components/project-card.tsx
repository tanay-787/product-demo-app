"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Copy, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { type ProjectWithOwner } from "@/lib/mock-project"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/status';

//To be Implemented: Rendering Core-Stack using TechStackCircles

interface ProjectCardProps {
    projectData: ProjectWithOwner
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onView?: (id: string) => void
    onDuplicate?: (id: string) => void
    className?: string
}

export function ProjectCard({ projectData, onEdit, onDelete, onView, onDuplicate, className }: ProjectCardProps) {
    const { project, owner } = projectData
    const [isHovered, setIsHovered] = useState(false)
    // Get the first 4 stack items for display
    const displayStack = project.stackJson.slice(0, 4)
    const remainingStack = project.stackJson.length > 4 ? project.stackJson.length - 4 : 0

    // Format dates
    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300",
                isHovered ? "shadow-lg shadow-primary/10" : "shadow-md",
                className,
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status indicator bar */}

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">{project.name}</CardTitle>

                    <div className="flex items-center gap-2">
                        <Status status={project?.buildStatus}>
                            <StatusIndicator />
                            <StatusLabel className="font-mono" />
                        </Status>


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                                <DropdownMenuItem onClick={() => onView?.(project.id)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit?.(project.id)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Config
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDuplicate?.(project.id)}>
                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onDelete?.(project.id)} className="">
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete Project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <CardDescription className="line-clamp-2 h-10">
                    {project.description || "No description provided"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-2">
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                    <TooltipProvider>
                        {displayStack.map((tech, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className="flex items-center gap-1 py-1">
                                        <span className={"text-xs"}>{tech}</span>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{tech}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}

                        {remainingStack > 0 && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className="py-1">
                                        +{remainingStack} more
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="space-y-1">
                                        {project.stackJson.slice(4).map((tech, index) => (
                                            <p key={index}>{tech}</p>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>

                {/* Metadata */}
            </CardContent>

            {/* <CardFooter className="pt-2">
                <div className="flex w-full gap-2">
                    <Button
                        variant="default"
                        className={cn("flex-1 transition-all", isHovered ? "bg-primary hover:bg-primary/90" : "")}
                        onClick={() => onView?.(project.id)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Project
                    </Button>

                    <Button variant="outline" size="icon" onClick={() => onEdit?.(project.id)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter> */}
        </Card>
    )
}
