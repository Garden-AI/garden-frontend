import React, { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizableHandle } from "@/components/shadcn/resizable";
import { 
  DndContext, 
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { LeftSidePanel } from "./components/LeftSidePanel";
import { MainContentPanel } from "./components/MainContentPanel";
import { RightSidePanel } from "./components/RightSidePanel";
import { useGetModelDeployments } from "../model-deployments/api/useGetModelDeployments";
import { usePatchGarden } from "../gardens/api/usePatchGarden";
import { useGetGardens } from "../gardens/api/useGetGardens";
import { useGetUserInfo } from "../users/api/useGetUserInfo";
import { toast } from "sonner";

type Entity = Garden | ModalFunction | ModelDeployment;

export const UnifiedManagementInterface = () => {
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const { data: modelDeployments } = useGetModelDeployments();
  const { data: userInfo } = useGetUserInfo();
  const { data: userGardens } = useGetGardens({
    owner_uuid: userInfo?.identity_id,
  });
  const patchGardenMutation = usePatchGarden();

  // Configure drag sensors with proper activation constraints
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // Require 10px movement before drag starts
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 10,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleItemSelected = (entity: Entity) => {
    setSelectedItem(entity);
  };

  const handleAfterDelete = () => {
    setSelectedItem(null);
  };

  const handleDeploymentCreated = (deployment: ModelDeployment) => {
    // Immediately select the deployment object - no need to search for it
    setSelectedItem(deployment);
  };

  const handleDragStart = (event: any) => {
    console.log('Drag start:', event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    console.log('Drag over:', { active: event.active.id, over: event.over?.id });
    setDropTargetId(event.over?.id || null);
  };

  // Helper function to get the dragged function for display in overlay
  const getDraggedFunction = (dragId: string): ModalFunction | null => {
    let functionId: number;
    
    if (dragId.startsWith('app-fn-')) {
      functionId = parseInt(dragId.replace('app-fn-', ''));
    } else {
      functionId = parseInt(dragId);
    }
    
    if (isNaN(functionId)) return null;
    
    // Check in model deployments
    for (const deployment of modelDeployments || []) {
      const found = deployment.originalData?.modal_functions?.find(fn => fn.id === functionId);
      if (found) return found;
    }
    
    // Check in user gardens
    for (const garden of userGardens || []) {
      const found = garden.modal_functions?.find(fn => fn.id === functionId);
      if (found) return found;
    }
    
    return null;
  };

  // Helper function to get the target garden for display
  const getTargetGarden = (dropId: string | null): Garden | null => {
    if (!dropId || !userGardens) return null;
    return userGardens.find(garden => garden.doi === dropId) || null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('Drag end event:', { active: active?.id, over: over?.id });
    setActiveId(null); // Clear active drag state
    setDropTargetId(null); // Clear drop target state
    
    if (!over || !active) {
      console.log('No valid drop target');
      return;
    }
    
    // Extract function ID from the drag ID - handles both "fn.id" and "app-fn-${fn.id}" formats
    const dragId = active.id as string;
    let functionId: number;
    
    if (dragId.startsWith('app-fn-')) {
      functionId = parseInt(dragId.replace('app-fn-', ''));
    } else {
      functionId = parseInt(dragId);
    }
    
    if (isNaN(functionId)) return;
    
    // Get the target garden DOI
    const gardenDoi = over.id as string;
    
    // Find the target garden
    const targetGarden = userGardens?.find(garden => garden.doi === gardenDoi);
    if (!targetGarden) return;
    
    // Only allow adding to user's own gardens
    if (targetGarden.owner_identity_id !== userInfo?.identity_id) {
      toast.error("You can only add functions to your own gardens");
      return;
    }
    
    // Find the function being dragged from all available sources
    let draggedFunction: ModalFunction | undefined;
    
    // Check in model deployments
    for (const deployment of modelDeployments || []) {
      const found = deployment.originalData?.modal_functions?.find(fn => fn.id === functionId);
      if (found) {
        draggedFunction = found;
        break;
      }
    }
    
    // Check in garden functions if not found in deployments
    if (!draggedFunction) {
      for (const garden of userGardens || []) {
        const found = garden.modal_functions?.find(fn => fn.id === functionId);
        if (found) {
          draggedFunction = found;
          break;
        }
      }
    }
    
    if (!draggedFunction) return;
    
    // Check if function is already in the target garden
    const isAlreadyInGarden = targetGarden.modal_functions?.some(fn => fn.id === functionId);
    if (isAlreadyInGarden) {
      toast.info(`"${draggedFunction.function_name}" is already in "${targetGarden.title}"`);
      return;
    }
    
    // Create updated modal_function_ids array
    const currentFunctionIds = targetGarden.modal_functions?.map(fn => fn.id) || [];
    const updatedFunctionIds = [...currentFunctionIds, functionId];
    
    // Update the garden
    patchGardenMutation.mutate(
      {
        doi: gardenDoi,
        garden: { modal_function_ids: updatedFunctionIds },
        successMessage: `Added "${draggedFunction.function_name}" to "${targetGarden.title}"`
      },
      {
        onError: (error) => {
          toast.error(`Failed to add function to garden: ${error.message}`);
        }
      }
    );
  };

  // Keep selected deployment in sync with fresh data from cache
  useEffect(() => {
    if (selectedItem && 'originalData' in selectedItem && selectedItem.originalData?.id) {
      // If a deployment is selected, find the updated version from the cache
      const updatedDeployment = modelDeployments?.find(
        deployment => deployment.originalData?.id === selectedItem.originalData?.id
      );
      
      // If we found an updated version and it's different, update the selection
      if (updatedDeployment && 
          updatedDeployment.status !== selectedItem.status) {
        setSelectedItem(updatedDeployment);
      }
    }
  }, [modelDeployments, selectedItem]);

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="scrollbar-thin scrollbar-track-transparent relative flex h-screen w-full items-center overflow-hidden bg-gray-100 p-2">
        <ResizablePanelGroup
          direction="horizontal"
          className="overflow-hidden rounded-lg shadow-sm"
        >
          <LeftSidePanel 
            onItemSelected={handleItemSelected} 
            selectedItem={selectedItem} 
            onDeploymentCreated={handleDeploymentCreated}
          />
          <ResizableHandle
            withHandle
            className="w-1 bg-slate-200 transition-colors hover:bg-slate-300"
          />
          <MainContentPanel entity={selectedItem} onAfterDelete={handleAfterDelete} />
          <ResizableHandle
            withHandle
            className="w-1 bg-slate-200 transition-colors hover:bg-slate-300"
          />
          <RightSidePanel entity={selectedItem} onItemSelected={handleItemSelected} />
        </ResizablePanelGroup>
      </div>
      
      {/* Floating Drop Indicator */}
      {activeId && dropTargetId && (() => {
        const draggedFunction = getDraggedFunction(activeId);
        const targetGarden = getTargetGarden(dropTargetId);
        return draggedFunction && targetGarden ? (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>Add "{draggedFunction.function_name}" to "{targetGarden.title}"</span>
            </div>
          </div>
        ) : null;
      })()}
      
      <DragOverlay>
        {activeId ? (() => {
          const draggedFunction = getDraggedFunction(activeId);
          return draggedFunction ? (
            <div className="flex items-center rounded-md border-2 border-blue-400 bg-blue-50 px-2 py-1.5 shadow-lg">
              <div className="truncate text-xs font-medium text-gray-700">
                {draggedFunction.function_name}
              </div>
            </div>
          ) : null;
        })() : null}
      </DragOverlay>
    </DndContext>
  );
};
