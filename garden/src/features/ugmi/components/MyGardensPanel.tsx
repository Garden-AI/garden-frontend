import React, { useState, useCallback } from "react";
import { Sprout } from "lucide-react";
import { GardenTree } from "./GardenTree";
import { PanelHeader } from "./PanelHeader";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { Garden, ModalFunction } from "@/types";
import { Entity } from "../types";
import { useSelection } from "../hooks";
import { usePatchGarden } from "../../gardens/api/usePatchGarden";
import { useGardenFiltering } from "../hooks/useGardenFiltering";
import { myGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";
import { toast } from "sonner";
import { CreateGardenForm } from "../../gardens/components/create/CreateGardenForm";
import { DragAndDropState } from "../hooks/useDragDrop";

type MyGardensPanelProps = {
  gardens: Garden[];
  onSelect?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean }) => void;
  onGardenCreated?: (garden: Garden) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
  selection: ReturnType<typeof useSelection>;
  isLoading?: boolean;
  dragAndDrop: DragAndDropState;
};

export const MyGardensPanel = ({
  gardens,
  onSelect,
  onGardenCreated,
  onDoubleClick,
  selectedItem,
  selection,
  isLoading = false,
  dragAndDrop
}: MyGardensPanelProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const patchGardenMutation = usePatchGarden();
  const filtering = useGardenFiltering(gardens, myGardensFilteringOptions);

  const handleCreateSuccess = useCallback((newGarden: Garden) => {
    if (onGardenCreated) {
      onGardenCreated(newGarden);
    }
    if (onSelect) {
      onSelect(newGarden);
    }
    setIsCreateDialogOpen(false);
  }, [onGardenCreated, onSelect]);

  // Create garden form component wrapper
  const CreateGardenComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    return (
      <CreateGardenForm
        onSuccess={(newGarden) => {
          handleCreateSuccess(newGarden);
          onSuccess();
        }}
      />
    );
  };

  const panelConfig = {
    icon: <Sprout className="h-5 w-5" />,
    title: "My Gardens",
    themeColors: {
      bg: "bg-emerald-100",
      border: "border-emerald-300",
      text: "text-emerald-900",
      iconColor: "text-emerald-700",
    },
  };

  const customActions = GardenPanelHeaderActions({
    filtering,
    searchPlaceholder: "Search my gardens...",
    showCreateButton: true,
    CreateComponent: CreateGardenComponent,
    createDialogTitle: "Create New Garden",
    onCreateSuccess: () => { },
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  })?.actions;

  return (
    <div className="h-full bg-emerald-50 rounded-lg">
      <div className="flex h-full flex-col">
        <PanelHeader
          icon={panelConfig.icon}
          title={panelConfig.title}
          count={filtering.processedGardens.length}
          onDoubleClick={onDoubleClick}
          themeColors={panelConfig.themeColors}
          actions={customActions}
          searchComponent={GardenPanelHeaderActions({
            filtering,
            showCreateButton: false,
          })?.searchComponent}
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

