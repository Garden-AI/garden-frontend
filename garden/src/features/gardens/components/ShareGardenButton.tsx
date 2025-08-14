import React from "react";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Garden } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

export const ShareGardenButton = ({ garden }: { garden: Garden }) => {

    const handleClick = () => {
        navigator.clipboard.writeText(`${window.location.origin}/#/garden/${encodeURIComponent(garden.doi)}`)
        toast.info("Garden URL copied to clipboard!")
    }
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <div className="h-5 w-5 flex items-center justify-center hover:bg-green-400">
                        <CopyIcon className="hover:text-green" onClick={handleClick} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copy Garden URL</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}