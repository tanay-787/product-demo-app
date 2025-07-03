import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider, // Important: TooltipProvider needs to wrap the Tooltip for it to work
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface ButtonTProps {
  buttonProps: React.ComponentProps<typeof Button>;
  tooltipProps?: React.ComponentProps<typeof TooltipContent> & {
    content: React.ReactNode; // Explicitly define content for the tooltip
  };
}

export function ButtonT({ buttonProps, tooltipProps }: ButtonTProps) {
  const { content, ...restTooltipProps } = tooltipProps;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...buttonProps} />
        </TooltipTrigger>
        <TooltipContent {...restTooltipProps}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}