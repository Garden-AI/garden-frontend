import React from "react";
import { Globe } from "lucide-react";
import { GardenTreeView } from "../GardenTreeView";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

type PublishedGardensPanelProps = {
    onSelect?: (entity: Entity) => void;
    selectedItem?: Entity | null;
};

export const PublishedGardensPanel = ({ onSelect, selectedItem }: PublishedGardensPanelProps) => {
    // Fetch published gardens (non-draft)
    const { data: publishedGardens } = useGetGardens({
        draft: false,
        limit: 100
    });

    return (
        <div className="h-full flex-1">
            <GardenTreeView
                gardens={publishedGardens || []}
                onSelect={onSelect}
                selectedItem={
                    selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
                        ? (selectedItem as Garden | ModalFunction)
                        : null
                }
                showHeader={true}
                headerIcon={<Globe className="h-4 w-4" />}
                headerTitle={`Published Gardens${publishedGardens ? ` (${publishedGardens.length})` : ''}`}
                headerThemeColors={{
                    bg: "bg-green-100",
                    border: "border-green-300",
                    text: "text-green-900",
                    iconColor: "text-green-700",
                    hoverColor: "hover:bg-green-200",
                    activeColor: "bg-green-200"
                }}
            />
        </div>
    );
};
