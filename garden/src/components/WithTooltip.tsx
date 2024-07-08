import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function WithTooltip({
  hint,
  children,
  className,
}: {
  children: any;
  hint: string;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={40}>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent>{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
