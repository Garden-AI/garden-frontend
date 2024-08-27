import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import WithTooltip from "./WithTooltip";

export default function CopyButton({
  hint,
  content,
  className,
  icon,
}: {
  hint?: string;
  content: any;
  className?: string;
  icon?: any;
}) {
  if (hint === undefined) {
    return (
      <CopyIconButton
        className={cn(
          "border-none bg-transparent text-gray-700 transition-colors hover:bg-transparent hover:text-gray-500",
          className,
        )}
        content={content} 
      >
        <Copy />
      </CopyIconButton>
    );
  }
  return (
    <WithTooltip hint={hint} className={className}>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(content);
          toast.success("Copied to clipboard!");
        }}
        variant="outline"
        size="icon"
        className={cn(
          "border-none bg-transparent text-gray-700 transition-colors hover:bg-transparent hover:text-gray-500",
          className,
        )}
      >
        {icon ? icon : <Copy className="h-8 w-8 p-1.5" />}
      </Button>
    </WithTooltip>
  );
}

const CopyIconButton = ({
  className,
  children,
  content,
}: {
  className?: string;
  children: any;
  content: string;
}) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
      }}
      variant="outline"
      size="icon"
      className={cn("h-8 w-8 p-1.5 transition-colors duration-200 ", className)}
    >
      {children}
    </Button>
  );
};
