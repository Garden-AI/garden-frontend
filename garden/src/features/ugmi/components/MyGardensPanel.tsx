import React from "react";
import { Sprout } from "lucide-react";
import { GardenTreeView } from "../GardenTreeView";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

type MyGardensPanelProps = {
    gardens: Garden[];
    onSelect?: (entity: Entity) => void;
    onGardenCreated?: (garden: Garden) => void;
    onDoubleClick?: () => void;
    selectedItem?: Entity | null;
    isLoading?: boolean;
};

export const MyGardensPanel = ({ gardens, onSelect, onGardenCreated, onDoubleClick, selectedItem, isLoading = false }: MyGardensPanelProps) => {
    return (
        <div className="h-full bg-emerald-50 rounded-lg">
            <GardenTreeView
                gardens={gardens}
                isLoading={isLoading}
                onSelect={onSelect}
                onGardenCreated={onGardenCreated}
                onDoubleClick={onDoubleClick}
                selectedItem={
                    selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
                        ? (selectedItem as Garden | ModalFunction)
                        : null
                }
                allowCreate={true}
                showHeader={true}
                headerIcon={<Sprout className="h-4 w-4" />}
                headerTitle="My Gardens"
                headerThemeColors={{
                    bg: "bg-emerald-100",
                    border: "border-emerald-300",
                    text: "text-emerald-900",
                    iconColor: "text-emerald-700",
                    hoverColor: "hover:bg-emerald-200",
                    activeColor: "bg-emerald-200"
                }}
                emptyDescription="Create a new Garden to get started"
            />
        </div>
    );
};

