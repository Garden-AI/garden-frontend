import React, { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { useGetModelDeployments } from "./api/useGetModelDeployments";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { StatusHeader } from "./StatusHeader";

export interface ModelDeployment {
    id: number,
    name: string,
    status: "deployed" | "undeployed" | "error",
    type: "Modal App" | "GCMU",
    modal_function_ids?: number[],
    updated_at?: string,
    originalData: any, // Will be either ModalAppMetadataResponse or future GCMU type
}

const statusColors = {
    deployed: 'bg-green/30 text-darkgreen',
    undeployed: 'bg-gray-200 text-black',
    error: 'bg-red-100 text-red-800',
};

export const ModelDeployments = () => {
    const navigate = useNavigate();
    const { data: modelDeployments, isLoading } = useGetModelDeployments();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "deployed" | "undeployed" | "error">("all");

    const handleCreateDeployment = () => {
        navigate("/modal-app/create");
    };

    const handleOpenDeployment = (deployment: ModelDeployment) => {
        const modalAppId = deployment.originalData?.id;
        navigate(`/model-deployments/${modalAppId}`);
    };

    const filteredDeployments = modelDeployments?.filter((deployment) => {
        const queryWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const haystack = `${deployment.name ?? ''} ${deployment.type ?? ''}`.toLowerCase();
        const matchesSearch = queryWords.every((word) => haystack.includes(word));
        const matchesStatus = statusFilter === "all" || deployment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return <LoadingOverlay />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-1 gap-3 flex-wrap sm:flex-nowrap items-stretch">
                    <Input
                        placeholder="Search deployments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <div className="w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="deployed">Deployed</SelectItem>
                                <SelectItem value="undeployed">Undeployed</SelectItem>
                                <SelectItem value ="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <div className="h-10">
                                <Button onClick={handleCreateDeployment} size={"sm"} variant={"outline"} className="h-full" aria-description="Create a new model deployment">
                                    <Plus className="mr-1 h-4 w-4"/>
                                    New Deployment
                                </Button>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Create a new Deployment</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="text-muted-foreground text-sm mt-1 ml-1">
                <StatusHeader colors={statusColors} />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredDeployments?.map((deployment) => {
                    const functionCount = deployment.originalData?.modal_function_ids?.length ?? 0;
                    const status = deployment.status;
                    const statusClass = statusColors[status];

                    return (
                        <div 
                            key={deployment.id}
                            onClick={() => handleOpenDeployment(deployment)}
                            className="w-full cursor-pointer rounded-xl border border-[#d6e9dd] bg-white hover:shadow-lg hover:ring-2 hover:ring-[#a5d6b1] transition px-5 py-4 flex flex-col gap-4 sm:flex-row sm:items-center justify-between"
                        >
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-base font-semibold text-[#1f3d2d]">{deployment.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap text-sm mt-2 gap-x-4 gap-y-1 text-muted-foreground">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{deployment.type}</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{functionCount} function{functionCount != 1 ? "s" : ""}</span>
                                </div>
                            </div>
                            
                            <Button
                                size="sm"
                                variant="secondary"
                                className="hover:bg-primary hover:text-white transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDeployment(deployment);
                                }}
                            >
                                Manage
                            </Button>
                        </div>
                    );
                })}
                {filteredDeployments?.length === 0 && (
                    <div className="col-span-full text-center text-sm text-gray-500 pt-8">
                        No deployments match your search.
                    </div>
                )}
            </div>
        </div>
    )
}
