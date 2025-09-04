import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Bookmark } from "lucide-react";
import { TreeView } from "./TreeView";
import { GardenTreeNode } from "./GardenTreeNode";
import { PanelHeader } from "./PanelHeader";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { Garden } from "@/types";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { useGardenFiltering } from "../hooks/useGardenFiltering";
import { savedGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";

export type SavedGardensPanelProps = {
  savedGardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
  selection?: ReturnType<typeof useSelection>;
  isLoading?: boolean;
  onGardenSaved?: (garden: Garden) => void;
};

export const SavedGardensPanel = ({
  savedGardens,
  onSelect,
  onDoubleClick = () => { },
  selectedItem,
  selection,
  isLoading = false,
  onGardenSaved,
}: SavedGardensPanelProps) => {
  const [expandedGardens, setExpandedGardens] = useState<Set<string>>(new Set());

  // Use the garden filtering hook
  const filtering = useGardenFiltering(savedGardens, savedGardensFilteringOptions);

  // Helper function to save a garden using the existing hook
  const handleSaveGarden = (garden: Garden) => {
    // We need to dynamically create and call the mutation
    // Since hooks can't be called conditionally, we'll pass this up to the parent
    if (onGardenSaved) {
      onGardenSaved(garden);
    }
  };

  // Create a droppable zone for the entire saved gardens panel for saving gardens
  const { setNodeRef, isOver } = useDroppable({
    id: "saved-gardens-panel",
    data: {
      onDrop: (draggedItems: any[]) => {
        // Handle gardens dropped to save them
        const gardens = draggedItems
          .filter(item => item.type === 'garden' || item.doi) // Handle both formats  
          .map(item => item.type === 'garden' ? item.data : item);

        gardens.forEach((garden: Garden) => {
          handleSaveGarden(garden);
        });
      }
    }
  });

  const handleToggleExpansion = (gardenDoi: string) => {
    setExpandedGardens(prev => {
      const next = new Set(prev);
      if (next.has(gardenDoi)) {
        next.delete(gardenDoi);
      } else {
        next.add(gardenDoi);
      }
      return next;
    });
  };

  const dropZoneClass = isOver
    ? "h-full w-full bg-amber-100 rounded-lg border-2 border-amber-400 border-dashed transition-all"
    : "h-full w-full bg-amber-50 rounded-lg transition-all";

  const themeColors = {
    bg: "bg-amber-100",
    border: "border-amber-300",
    text: "text-amber-900",
    iconColor: "text-amber-700",
  };

  const headerActions = GardenPanelHeaderActions({
    filtering,
    searchPlaceholder: "Search saved gardens...",
    showCreateButton: false, // No create button for saved gardens
  });

  return (
    <div ref={setNodeRef} className={dropZoneClass}>
      <PanelHeader
        icon={<Bookmark className="h-5 w-5" />}
        title="Saved Gardens"
        count={filtering.processedGardens.length}
        onDoubleClick={onDoubleClick}
        themeColors={themeColors}
        actions={headerActions.actions}
        searchComponent={headerActions.searchComponent}
        showSearchToggle={true}
      />

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : filtering.processedGardens.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
            <Bookmark className="h-12 w-12 text-gray-300" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {savedGardens.length === 0 ? "No Saved Gardens" : "No matches found"}
              </p>
              <p className="text-xs text-gray-500">
                {savedGardens.length === 0 ? "Save a Garden" : "Try adjusting your search"}
              </p>
            </div>
          </div>
        ) : (
          <TreeView>
            {filtering.processedGardens.map(garden => (
              <GardenTreeNode
                key={garden.doi}
                garden={garden}
                selection={selection}
                onSelect={onSelect}
                isExpanded={expandedGardens.has(garden.doi)}
                onToggleExpanded={() => handleToggleExpansion(garden.doi)}
                panelId="saved-gardens"
              />
            ))}
          </TreeView>
        )}
      </div>
    </div>
  );
};

