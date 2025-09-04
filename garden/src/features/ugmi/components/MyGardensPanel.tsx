import React, { useState } from "react";
import { Sprout } from "lucide-react";
import { TreeView } from "./TreeView";
import { GardenTreeNode } from "./GardenTreeNode";
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

type MyGardensPanelProps = {
  gardens: Garden[];
  onSelect?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
  onGardenCreated?: (garden: Garden) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
  selection: ReturnType<typeof useSelection>;
  isLoading?: boolean;
};

export const MyGardensPanel = ({
  gardens,
  onSelect,
  onGardenCreated,
  onDoubleClick,
  selectedItem,
  selection,
  isLoading = false
}: MyGardensPanelProps) => {
  const [expandedGardens, setExpandedGardens] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const patchGardenMutation = usePatchGarden();

  // Use the garden filtering hook
  const filtering = useGardenFiltering(gardens, myGardensFilteringOptions);

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

  const handleCreateSuccess = (newGarden: Garden) => {
    if (onGardenCreated) {
      onGardenCreated(newGarden);
    }
    if (onSelect) {
      onSelect(newGarden);
    }
    setIsCreateDialogOpen(false);
  };

  const handleAddToGarden = (draggedItems: any[], garden: Garden) => {
    // Extract functions from dragged items
    const functions = draggedItems
      .filter(item => item.type === 'function' || item.function_name) // Handle both formats
      .map(item => item.type === 'function' ? item.data : item);

    if (functions.length === 0) return;

    // Create updated modal_function_ids array
    const currentFunctionIds = garden.modal_functions?.map(fn => fn.id) || [];
    const newFunctionIds = functions.map((fn: ModalFunction) => fn.id);

    // Filter out functions already in the target garden
    const existingFunctionIds = new Set(currentFunctionIds);
    const filteredNewIds = newFunctionIds.filter(id => !existingFunctionIds.has(id));

    if (filteredNewIds.length === 0) {
      const functionNames = functions.map((fn: ModalFunction) => fn.function_name).join(', ');
      toast.info(`${functionNames} already in "${garden.title}"`);
      return;
    }

    const updatedFunctionIds = [...currentFunctionIds, ...filteredNewIds];

    // Update the garden
    patchGardenMutation.mutate({
      doi: garden.doi,
      garden: { modal_function_ids: updatedFunctionIds },
      successMessage: `Added ${filteredNewIds.length === 1 ? `"${functions[0].function_name}"` : `${filteredNewIds.length} functions`} to "${garden.title}"`
    });
  };

  const themeColors = {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-900",
    iconColor: "text-emerald-700",
  };

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

  const headerActions = GardenPanelHeaderActions({
    filtering,
    searchPlaceholder: "Search my gardens...",
    showCreateButton: true,
    CreateComponent: CreateGardenComponent,
    createDialogTitle: "Create New Garden",
    onCreateSuccess: () => { },
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  });

  return (
    <div className="h-full bg-emerald-50 rounded-lg">
      <PanelHeader
        icon={<Sprout className="h-5 w-5" />}
        title="My Gardens"
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
            <Sprout className="h-12 w-12 text-gray-300" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {gardens.length === 0 ? "No Gardens" : "No matches found"}
              </p>
              <p className="text-xs text-gray-500">
                {gardens.length === 0 ? "Create a new Garden to get started" : "Try adjusting your search or filters"}
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
                onDrop={(items) => handleAddToGarden(items, garden)}
                isExpanded={expandedGardens.has(garden.doi)}
                onToggleExpanded={() => handleToggleExpansion(garden.doi)}
                panelId="my-gardens"
              />
            ))}
          </TreeView>
        )}
      </div>
    </div>
  );
};

