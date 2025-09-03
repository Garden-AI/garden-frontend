import React, { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizableHandle } from "@/components/shadcn/resizable";
import { DndContext } from "@dnd-kit/core";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { LeftSidePanel } from "./components/LeftSidePanel";
import { MainContentPanel } from "./components/MainContentPanel";
import { RightSidePanel } from "./components/RightSidePanel";
import { useGetModelDeployments } from "../model-deployments/api/useGetModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

export const UnifiedManagementInterface = () => {
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const { data: modelDeployments } = useGetModelDeployments();

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
    <DndContext>
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
    </DndContext>
  );
};
