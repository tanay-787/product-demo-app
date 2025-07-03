"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Define the tech stack item type
export interface TechStackItem {
  id: string
  name: string
  icon: React.ReactElement<{ className?: string }> // This will be an SVG component with className prop
  color?: string // Optional color for the icon
}

interface TechStackCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TechStackItem[]
  maxItems?: number
  size?: "sm" | "md" | "lg"
  overlap?: number // Percentage of overlap (0-100)
  className?: string
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

export function TechStackCircles({
  items,
  maxItems = 10,
  size = "md",
  overlap = 30,
  className,
  ...props
}: TechStackCirclesProps) {
  const visibleItems = items.slice(0, maxItems)
  const remainingCount = Math.max(0, items.length - maxItems)
  const sizeClass = sizeMap[size]

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <div className="flex">
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-center rounded-full bg-muted border-2 border-background",
              sizeClass,
              "transition-transform hover:scale-110 hover:z-10",
              "shadow-sm",
              {
                "-ml-3 first:ml-0": overlap > 0,
              }
            )}
            style={{
              marginLeft: index > 0 ? `-${overlap}%` : 0,
            }}
            title={item.name}
          >
            <div className={cn("flex items-center justify-center w-full h-full")}>
              {React.cloneElement(item.icon, {
                className: cn("w-1/2 h-1/2", item.color, item.icon.props.className),
              })}
            </div>
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-muted border-2 border-background text-xs font-medium",
              sizeClass,
              "-ml-3"
            )}
            title={`${remainingCount} more`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  )
}
