import React from "react";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Garden } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { Button } from "@/components/shadcn/button";

export const ShareGardenButton = ({ garden }: { garden: Garden }) => {

    const useDoi = !garden.doi_is_draft;
    const copyText = (useDoi) ? `https://doi.org/${garden.doi}`
        : `${window.location.origin}/#/garden/${encodeURIComponent(garden.doi)}`;
    const toastText = (useDoi) ? "doi.org URL" : "URL";

    const handleClick = () => {
        navigator.clipboard.writeText(copyText)
        toast.info(`Garden ${toastText} copied to clipboard!`)
    }
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size={"icon"} className="hover:text-teal" onClick={handleClick}>
                        <Clipboard />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copy Garden {toastText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}