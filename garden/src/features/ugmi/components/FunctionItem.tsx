import React from "react";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

// Extended function type with deployment info
type FunctionWithDeployment = ModalFunction & {
    deploymentId: number;
    deploymentName: string;
    deploymentStatus: string;
};

type FunctionItemProps = {
    func: FunctionWithDeployment & { inGarden?: boolean };
    onSelect?: (entity: Entity) => void;
    selectedItem?: Entity | null;
    showInGardenBadge?: boolean;
};

export const FunctionItem = ({
    func,
    onSelect,
    selectedItem,
    showInGardenBadge = false,
}: FunctionItemProps) => {
    const isSelected =
        selectedItem &&
        "id" in selectedItem &&
        selectedItem.id === func.id &&
        ("function_name" in selectedItem || "title" in selectedItem);

    const handleSelect = () => {
        if (onSelect) {
            onSelect(func as ModalFunction);
        }
    };

    return (
        <div
            onClick={handleSelect}
            className={`
        group cursor-pointer rounded p-2 transition-all duration-150
        ${isSelected
                    ? "border-2 border-blue-400 bg-blue-100 shadow-sm"
                    : "border border-transparent hover:bg-white hover:shadow-sm"
                }
      `}
        >
            <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                        <div className="truncate text-sm font-medium text-gray-900">
                            {func.function_name || func.title}
                        </div>
                        {showInGardenBadge && func.inGarden && (
                            <span className="flex-shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-600">
                                ✓ in garden
                            </span>
                        )}
                    </div>
                    {func.description && (
                        <div className="line-clamp-2 text-xs text-gray-500">{func.description}</div>
                    )}
                </div>
            </div>
        </div>
    );
};
