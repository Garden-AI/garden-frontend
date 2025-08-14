import React from "react";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Garden } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { Button } from "@/components/shadcn/button";

export const ShareGardenButton = ({ garden }: { garden: Garden }) => {

    const handleClick = () => {
        navigator.clipboard.writeText(`${window.location.origin}/#/garden/${encodeURIComponent(garden.doi)}`)
        toast.info("Garden URL copied to clipboard!")
    }
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size={"icon"} className="hover:text-green" onClick={handleClick}>
                        <Clipboard />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copy Garden URL</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}