import React, { useState } from "react";
import { ResizablePanelGroup, ResizableHandle } from "@/components/shadcn/resizable";
import { DndContext } from "@dnd-kit/core";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { LeftSidePanel } from "./components/LeftSidePanel";
import { MainContentPanel } from "./components/MainContentPanel";
import { RightSidePanel } from "./components/RightSidePanel";

type Entity = Garden | ModalFunction | ModelDeployment;

export const UnifiedManagementInterface = () => {
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);

  const handleItemSelected = (entity: Entity) => {
    setSelectedItem(entity);
  };

  const handleAfterDelete = () => {
    setSelectedItem(null);
  };

  return (
    <DndContext>
      <div className="scrollbar-thin scrollbar-track-transparent relative flex h-screen w-full items-center overflow-hidden bg-gray-100 p-2">
        <ResizablePanelGroup
          direction="horizontal"
          className="overflow-hidden rounded-lg shadow-sm"
        >
          <LeftSidePanel onItemSelected={handleItemSelected} selectedItem={selectedItem} />
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
