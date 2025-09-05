import React from "react";
import { Globe } from "lucide-react";
import { BaseGardenPanel } from "./BaseGardenPanel";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { publishedGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";

export type PublishedGardensPanelProps = {
    onSelect?: (entity: Entity) => void;
    onDoubleClick?: () => void;
    selectedItem?: Entity | null;
    selection?: ReturnType<typeof useSelection>;
};

export const PublishedGardensPanel = ({ onSelect, onDoubleClick, selectedItem, selection }: PublishedGardensPanelProps) => {
    // Fetch published gardens (non-draft) - lowest priority
    const { data: publishedGardens = [], isLoading: publishedGardensLoading } = useGetGardens({
        draft: false,
        limit: 100
    });

    const panelConfig = {
        icon: <Globe className="h-5 w-5" />,
        title: "Published Gardens",
        themeColors: {
            bg: "bg-purple-100",
            border: "border-purple-300",
            text: "text-purple-900",
            iconColor: "text-purple-700",
        },
    };

    return (
        <div className="h-full flex-1 bg-purple-50 rounded-lg">
            <BaseGardenPanel
                gardens={publishedGardens}
                onSelect={onSelect}
                onDoubleClick={onDoubleClick}
                selectedItem={selectedItem}
                selection={selection}
                isLoading={publishedGardensLoading}
                panelConfig={panelConfig}
                filteringOptions={publishedGardensFilteringOptions}
            />
        </div>
    );
};

