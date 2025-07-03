"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { ArrowLeft, Save, Eye, Share2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { UserButton, useUser } from "@stackframe/react"
import api from "@/lib/api"

interface Tour {
  id: string
  title: string
  status: "draft" | "published" | "private"
  updatedAt: string
}

interface EditorHeaderProps {
  currentTourId?: string | null
  currentTourTitle?: string
  onSave?: () => void
  onPreview?: () => void
  onShare?: () => void
  isSaving?: boolean
}

export function EditorHeader({
  currentTourId,
  currentTourTitle = "Untitled Tour",
  onSave,
  onPreview,
  onShare,
  isSaving = false,
}: EditorHeaderProps) {
  const navigate = useNavigate()
  const user = useUser({ or: "redirect" })
  const [open, setOpen] = React.useState(false)

  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ["tours"],
    queryFn: async () => {
      if (!user) return []
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<{ tours: Tour[] }>("/tours", { headers: authHeaders })
      return response.data.tours
    },
    enabled: !!user,
  })

  const handleTourSwitch = (tourId: string) => {
    if (tourId !== currentTourId) {
      navigate(`/editor?tourId=${tourId}`)
    }
    setOpen(false)
  }

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}

          {/* Back Button */}
          <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>

          {/* Tour Switcher */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-fit justify-between bg-transparent"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{currentTourTitle}</span>
                  {currentTourId && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search tours..." />
                <CommandList>
                  <CommandEmpty>No tours found.</CommandEmpty>
                  <CommandGroup>
                    {tours.map((tour) => (
                      <CommandItem key={tour.id} value={tour.title} onSelect={() => handleTourSwitch(tour.id)}>
                        <Check
                          className={cn("mr-2 h-4 w-4", currentTourId === tour.id ? "opacity-100" : "opacity-0")}
                        />
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{tour.title}</span>
                          <Badge
                            variant={
                              tour.status === "published"
                                ? "default"
                                : tour.status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs ml-2"
                          >
                            {tour.status}
                          </Badge>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
{/* 
        <div className="flex items-center gap-3 md:block sm:hidden">
            <h1 className="text-2xl font-bold text-primary"><LineShadowText className="italic" shadowColor='--var(primary)'>Tourify's</LineShadowText> Tour Editor</h1>
          </div> */}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreview} className="gap-2 bg-transparent">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={onShare} className="gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button onClick={onSave} disabled={isSaving} size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <UserButton/>
        </div>
      </div>
    </header>
  )
}
