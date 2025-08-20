import { Copy } from "lucide-react";
import { Button } from "./shadcn/button";
import { toast } from "sonner";
import { cn } from "@/utils/form.utils";
import WithTooltip from "./WithTooltip";

export default function CopyButton({
  hint,
  content,
  className,
  icon,
  ...accessibilityProps
}: {
  hint?: string;
  content: any;
  className?: string;
  icon?: any;
  [key: string]: any;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  if (hint === undefined) {
    return (
      <Button
        onClick={handleCopy}
        variant="outline"
        size="icon"
        className={cn(
          "h-8 w-8 p-1.5 transition-colors duration-200 border-none bg-transparent text-gray-700 hover:bg-transparent hover:text-gray-500",
          className,
        )}
        aria-label={accessibilityProps["aria-label"] || "Copy to clipboard"}
        title={accessibilityProps.title || accessibilityProps["aria-label"] || "Copy to clipboard"}
        {...accessibilityProps}
      >
        <Copy className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <WithTooltip hint={hint} className={className}>
      <Button
        onClick={handleCopy}
        variant="outline"
        size="icon"
        className={cn(
          "border-none bg-transparent text-gray-700 transition-colors hover:bg-transparent hover:text-gray-500",
          className,
        )}
        aria-label={accessibilityProps["aria-label"] || hint}
        title={accessibilityProps.title || accessibilityProps["aria-label"] || hint}
        {...accessibilityProps}
      >
        {icon ? icon : <Copy className="h-8 w-8 p-1.5" />}
      </Button>
    </WithTooltip>
  );
}