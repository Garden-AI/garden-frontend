import React, { useState } from "react";
import { Sprout } from "lucide-react";
import { BaseGardenPanel } from "./BaseGardenPanel";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { Garden, ModalFunction, HpcFunction, GardenPatchRequest } from "@/types";
import { Entity, isHpcFunction } from "../types";
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const patchGardenMutation = usePatchGarden();

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
      .filter(item => item.type === 'function' || item.function_name)
      .map(item => item.type === 'function' ? item.data : item);

    if (functions.length === 0) return;

    // Determine if we're adding HPC or Modal functions (check first function)
    const isHpc = isHpcFunction(functions[0]);

    const currentIds = isHpc
      ? garden.hpc_functions?.map(fn => fn.id) || []
      : garden.modal_functions?.map(fn => fn.id) || [];

    const newIds = functions.map((fn: ModalFunction | HpcFunction) => fn.id);
    const existingIds = new Set(currentIds);
    const filteredNewIds = newIds.filter(id => !existingIds.has(id));

    if (filteredNewIds.length === 0) {
      const functionNames = functions.map((fn: ModalFunction | HpcFunction) => fn.function_name || fn.title).join(', ');
      toast.info(`${functionNames} already in "${garden.title}"`);
      return;
    }

    const updatedIds = [...currentIds, ...filteredNewIds];

    // Only send the array we're actually updating
    const patchRequest: GardenPatchRequest = isHpc
      ? { hpc_function_ids: updatedIds }
      : { modal_function_ids: updatedIds };

    patchGardenMutation.mutate({
      doi: garden.doi,
      garden: patchRequest,
      successMessage: `Added ${filteredNewIds.length === 1 ? `"${functions[0].function_name || functions[0].title}"` : `${filteredNewIds.length} functions`} to "${garden.title}"`
    });
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

  const customActions = (filtering: ReturnType<typeof useGardenFiltering>) => 
    GardenPanelHeaderActions({
      filtering,
      searchPlaceholder: "Search my gardens...",
      showCreateButton: true,
      CreateComponent: CreateGardenComponent,
      createDialogTitle: "Create New Garden",
      onCreateSuccess: () => { },
      isCreateDialogOpen,
      setIsCreateDialogOpen,
    })?.actions;

  const customGardenNodeProps = (garden: Garden) => ({
    onDrop: (items: any[]) => handleAddToGarden(items, garden)
  });

  return (
    <div className="h-full bg-emerald-50 rounded-lg">
      <BaseGardenPanel
        gardens={gardens}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
        selectedItem={selectedItem}
        selection={selection}
        isLoading={isLoading}
        panelConfig={panelConfig}
        filteringOptions={myGardensFilteringOptions}
        customActions={customActions}
        customGardenNodeProps={customGardenNodeProps}
        droppableProps={{ id: "my-gardens" }}
      />
    </div>
  );
};

