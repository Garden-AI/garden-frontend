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
      <CopyIconButton className={className}>
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
        className="transition-colors duration-200 hover:bg-gray-100 hover:text-primary"
      >
        {icon ? icon : <Copy />}
      </Button>
    </WithTooltip>
  );
}

const CopyIconButton = ({
  className,
  children,
}: {
  className?: string;
  children: any;
}) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText("paper.citation");
        toast.success("Copied to clipboard!");
      }}
      variant="outline"
      size="icon"
      className={cn(
        "transition-colors duration-200 hover:bg-gray-100 hover:text-primary",
        className,
      )}
    >
      {children}
    </Button>
  );
};
