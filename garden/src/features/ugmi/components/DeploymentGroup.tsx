import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { FunctionItem } from "./FunctionItem";

type Entity = Garden | ModalFunction | ModelDeployment;

// Extended function type with deployment info
type FunctionWithDeployment = ModalFunction & {
    deploymentId: number;
    deploymentName: string;
    deploymentStatus: string;
};

type DeploymentGroupProps = {
    deployment: ModelDeployment;
    functions: Array<FunctionWithDeployment & { inGarden: boolean }>;
    onSelect?: (entity: Entity) => void;
    selectedItem?: Entity | null;
};

export const DeploymentGroup = ({
    deployment,
    functions,
    onSelect,
    selectedItem,
}: DeploymentGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const getDeploymentStatusIcon = (status: string) => {
        switch (status) {
            case "deployed":
                return "🟢";
            case "error":
                return "🔴";
            case "undeployed":
            default:
                return "🟡";
        }
    };

    const getDeploymentStatusColor = (status: string) => {
        switch (status) {
            case "deployed":
                return "border-green-200 bg-green-50";
            case "error":
                return "border-red-200 bg-red-50";
            case "undeployed":
            default:
                return "border-yellow-200 bg-yellow-50";
        }
    };

    const functionsInGardens = functions.filter((f) => f.inGarden).length;

    // Check if this deployment is selected
    const isDeploymentSelected =
        selectedItem &&
        "originalData" in selectedItem &&
        "status" in selectedItem &&
        selectedItem.id === deployment.id;

    const handleDeploymentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSelect) {
            onSelect(deployment);
        }
    };

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`border-b border-gray-200 ${getDeploymentStatusColor(deployment.status)}`}>
            {/* Deployment Header */}
            <div className="flex">
                {/* Expand/Collapse button */}
                <button
                    className="flex items-center px-2 py-2 transition-colors hover:bg-gray-100"
                    onClick={handleExpandClick}
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                    )}
                </button>

                {/* Deployment info - clickable to select deployment */}
                <div
                    className={`flex-1 cursor-pointer px-1 py-2 transition-colors ${isDeploymentSelected
                            ? "border-r-4 border-purple-400 bg-purple-100"
                            : "hover:bg-gray-100"
                        }`}
                    onClick={handleDeploymentClick}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs">{getDeploymentStatusIcon(deployment.status)}</span>
                            <span className="text-sm font-medium text-gray-800">{deployment.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {functionsInGardens > 0 && (
                                <span className="text-green-600 bg-green-100 rounded px-2 py-1 text-xs">
                                    {functionsInGardens} in gardens
                                </span>
                            )}
                            <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-500">
                                {functions.length} function{functions.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Function List */}
            {isExpanded && (
                <div className="px-2 pb-2">
                    <div className="space-y-1">
                        {functions.map((func) => (
                            <FunctionItem
                                key={func.id}
                                func={func}
                                onSelect={onSelect}
                                selectedItem={selectedItem}
                                showInGardenBadge={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
