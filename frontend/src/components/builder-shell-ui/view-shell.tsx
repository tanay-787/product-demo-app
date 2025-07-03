import type React from "react"
import { cn } from "@/lib/utils"

interface ViewShellProps {
  title: string
  description: string
  children: React.ReactNode
  actionButton?: React.ReactNode
  className?: string
  // Optional visual enhancements
  icon?: React.ReactNode
  badge?: string
  variant?: "default" | "feature" | "compact"
}

export const ViewShell: React.FC<ViewShellProps> = ({
  title,
  description,
  children,
  actionButton,
  className,
  icon,
  badge,
  variant = "default",
}) => {
  return (
    <div className={cn("relative min-h-full", variant === "compact" ? "p-4 md:p-6" : "p-6 md:p-8 lg:p-10", className)}>
      {/* Background Pattern - Subtle grid for visual interest */}
      <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Title Row with Icon and Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              {icon && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                  {icon}
                </div>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {title}
                </h1>
                {badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {badge}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
          </div>

          {/* Action Button */}
          {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-background px-4">
              <div className="w-2 h-2 rounded-full bg-border/50" />
            </div>
          </div>
        </div>

        {/* Main Content Area with Enhanced Container */}
        <div
          className={cn(
            "relative",
            variant === "feature" && "bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 md:p-8",
          )}
        >
          {variant === "feature" && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-xl pointer-events-none" />
          )}
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  )
}
