import React, { useCallback } from "react";
import { Bookmark } from "lucide-react";
import { GardenTree } from "./GardenTree";
import { PanelHeader } from "./PanelHeader";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { Garden } from "@/types";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { useGardenFiltering } from "../hooks/useGardenFiltering";
import { savedGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";
import { DragAndDropState } from "../hooks/useDragDrop";

export type SavedGardensPanelProps = {
  savedGardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
  selection?: ReturnType<typeof useSelection>;
  isLoading?: boolean;
  onGardenSaved?: (garden: Garden) => void;
  dragAndDrop: DragAndDropState;
};

export const SavedGardensPanel = ({
  savedGardens,
  onSelect,
  onDoubleClick = () => { },
  selectedItem,
  selection,
  isLoading = false,
  onGardenSaved,
  dragAndDrop,
}: SavedGardensPanelProps) => {
  const filtering = useGardenFiltering(savedGardens, savedGardensFilteringOptions);

  const handleSaveGarden = useCallback((garden: Garden) => {
    if (onGardenSaved) {
      onGardenSaved(garden);
    }
  }, [onGardenSaved]);

  const panelConfig = {
    icon: <Bookmark className="h-5 w-5" />,
    title: "Saved Gardens",
    themeColors: {
      bg: "bg-amber-100",
      border: "border-amber-300",
      text: "text-amber-900",
      iconColor: "text-amber-700",
    },
  };

  const headerActions = GardenPanelHeaderActions({
    filtering,
    showCreateButton: false,
  });

  return (
    <div className="h-full w-full bg-amber-50 rounded-lg">
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
          {isLoading ? (
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

