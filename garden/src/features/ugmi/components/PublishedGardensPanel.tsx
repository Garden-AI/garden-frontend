import React from "react";
import { Globe } from "lucide-react";
import { GardenTreeView } from "../GardenTreeView";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

type PublishedGardensPanelProps = {
    onSelect?: (entity: Entity) => void;
    onDoubleClick?: () => void;
    selectedItem?: Entity | null;
};

export const PublishedGardensPanel = ({ onSelect, onDoubleClick, selectedItem }: PublishedGardensPanelProps) => {
    // Fetch published gardens (non-draft) - lowest priority
    const { data: publishedGardens, isLoading: publishedGardensLoading } = useGetGardens({
        draft: false,
        limit: 100
    });

    return (
        <div className="h-full flex-1 bg-purple-50 rounded-lg">
            <GardenTreeView
                gardens={publishedGardens || []}
                isLoading={publishedGardensLoading}
                onSelect={onSelect}
                onDoubleClick={onDoubleClick}
                selectedItem={
                    selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
                        ? (selectedItem as Garden | ModalFunction)
                        : null
                }
                showHeader={true}
                headerIcon={<Globe className="h-4 w-4" />}
                headerTitle={`Published Gardens${publishedGardens ? ` (${publishedGardens.length})` : ''}`}
                headerThemeColors={{
                    bg: "bg-purple-100",
                    border: "border-purple-300",
                    text: "text-purple-900",
                    iconColor: "text-purple-700",
                    hoverColor: "hover:bg-purple-200",
                    activeColor: "bg-purple-200"
                }}
            />
        </div>
    );
};

