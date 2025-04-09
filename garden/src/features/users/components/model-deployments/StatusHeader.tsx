import { useState } from "react";
import { InfoIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/shadcn/tooltip";

export interface StatusColors {
    deployed: string,
    undeployed: string,
    frozen: string,
    error: string,
}

export interface StatusHeaderProps {
    colors: StatusColors,
}

export const StatusHeader = ({colors}: StatusHeaderProps) => {
    const [open, setOpen] = useState(false);
    
    return (<div className="flex items-center gap-2">
        <span>Status</span>
        <TooltipProvider>
            <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                    <button 
                        onClick={() => setOpen(!open)}
                        className="focus:outline-none"
                    >
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                    </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                        <p className="font-medium">Status Meanings:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.deployed}`}>
                                    Deployed
                                </span>
                                <span> - model is deployed and ready to run</span>
                            </li>
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.undeployed}`}>
                                    Undeployed
                                </span>
                                <span> - model is not deployed and cannot be run</span>
                            </li>
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.frozen}`}>
                                    Frozen
                                </span>
                                <span> - model has been temporarily undeployed because it has been unused, it will automatically re-deploy when run</span>
                            </li>
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.error}`}>
                                    Error
                                </span>
                                <span> - an error occurred during deployment and the model is not runnable</span>
                            </li>
                        </ul>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>);
};