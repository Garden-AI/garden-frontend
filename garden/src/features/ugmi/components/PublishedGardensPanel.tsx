import React from "react";
import { Globe } from "lucide-react";
import { GardenTree } from "./GardenTree";
import { PanelHeader } from "./PanelHeader";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { useGardenFiltering } from "../hooks/useGardenFiltering";
import { publishedGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";
import { DragAndDropState } from "../hooks/useDragDrop";

export type PublishedGardensPanelProps = {
    onSelect?: (entity: Entity) => void;
    onDoubleClick?: () => void;
    selectedItem?: Entity | null;
    selection?: ReturnType<typeof useSelection>;
    dragAndDrop: DragAndDropState;
};

export const PublishedGardensPanel = ({ onSelect, onDoubleClick, selectedItem, selection, dragAndDrop }: PublishedGardensPanelProps) => {
    // Fetch published gardens (non-draft) - lowest priority
    const { data: publishedGardens = [], isLoading: publishedGardensLoading } = useGetGardens({
        draft: false,
        limit: 100
    });
    
    const filtering = useGardenFiltering(publishedGardens, publishedGardensFilteringOptions);

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

    const headerActions = GardenPanelHeaderActions({
        filtering,
        showCreateButton: false,
    });

    return (
        <div className="h-full flex-1 bg-purple-50 rounded-lg">
            <div className="flex h-full flex-col">
                <PanelHeader
                    icon={panelConfig.icon}
                    title={panelConfig.title}
                    count={filtering.processedGardens.length}
                    onDoubleClick={onDoubleClick}
                    themeColors={panelConfig.themeColors}
                    actions={headerActions?.actions}
                    searchComponent={headerActions?.searchComponent}
                    showSearchToggle={true}
                />
                
                <div className="flex-1 overflow-hidden">
                    {publishedGardensLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-sm text-gray-500">Loading...</div>
                        </div>
                    ) : filtering.processedGardens.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
                            {panelConfig.icon}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-600">
                                    {filtering.searchTerm || filtering.hasActiveFilters ? "No matches found" : "No gardens found"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {filtering.searchTerm || filtering.hasActiveFilters ? "Try adjusting your search or filters" : "No gardens available"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <GardenTree
                            gardens={filtering.processedGardens}
                            selectedItem={selectedItem}
                            onItemSelected={onSelect}
                            draggedItems={dragAndDrop.draggedItems}
                            setDraggedItems={dragAndDrop.setDraggedItems}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

