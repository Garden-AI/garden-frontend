import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Bookmark } from "lucide-react";
import { BaseGardenPanel } from "./BaseGardenPanel";
import { Garden } from "@/types";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { savedGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";
import { useSaveGarden } from "@/features/gardens/api/useSaveGarden";

export type SavedGardensPanelProps = {
  savedGardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
  selection?: ReturnType<typeof useSelection>;
  isLoading?: boolean;
};

export const SavedGardensPanel = ({
  savedGardens,
  onSelect,
  onDoubleClick = () => { },
  selectedItem,
  selection,
  isLoading = false,
}: SavedGardensPanelProps) => {
  // Get the save garden mutation function
  const { mutate: saveGarden } = useSaveGarden();

  // Helper function to save a garden
  const handleSaveGarden = (garden: Garden) => {
    saveGarden(garden.doi);
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

  const dropZoneClass = isOver
    ? "h-full w-full bg-amber-100 rounded-lg border-2 border-amber-400 border-dashed transition-all"
    : "h-full w-full bg-amber-50 rounded-lg transition-all";

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

  const droppableProps = {
    id: "saved-gardens-panel",
    onDrop: (draggedItems: any[]) => {
      const gardens = draggedItems
        .filter(item => item.type === 'garden' || item.doi)
        .map(item => item.type === 'garden' ? item.data : item);
      gardens.forEach((garden: Garden) => handleSaveGarden(garden));
    }
  };

  return (
    <div ref={setNodeRef} className={dropZoneClass}>
      <BaseGardenPanel
        gardens={savedGardens}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
        selectedItem={selectedItem}
        selection={selection}
        isLoading={isLoading}
        panelConfig={panelConfig}
        filteringOptions={savedGardensFilteringOptions}
        droppableProps={droppableProps}
      />
    </div>
  );
};

