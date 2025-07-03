"use client"

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ComponentProps, HTMLAttributes } from 'react';
export type StatusProps = ComponentProps<typeof Badge> & {
  status: 'generated' | 'error' | 'idle' | 'in-progress';
};
export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    variant="secondary"
    className={cn('flex items-center gap-2', 'group', status, className)}
    {...props}
  />
);
export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className="relative flex h-2 w-2" {...props}>
    <span
      className={cn(
        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
        'group-[.generated]:bg-emerald-500',
        'group-[.error]:bg-red-500',
        'group-[.idle]:bg-blue-500',
        'group-[.in-progress]:bg-amber-500'
      )}
    />
    <span
      className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        'group-[.generated]:bg-emerald-500',
        'group-[.error]:bg-red-500',
        'group-[.idle]:bg-blue-500',
        'group-[.in-progress]:bg-amber-500'
      )}
    />
  </span>
);
export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;
export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => (
  <span className={cn('text-muted-foreground', className)} {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.generated]:block">Ready</span>
        <span className="hidden group-[.error]:block">Failed</span>
        <span className="hidden group-[.idle]:block">Not Started</span>
        <span className="hidden group-[.in-progress]:block">Generating</span>
      </>
    )}
  </span>
);
