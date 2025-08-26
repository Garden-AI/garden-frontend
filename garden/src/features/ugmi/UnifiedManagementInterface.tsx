import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/shadcn/resizable";
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
  const auth = useGlobusAuth();

  const handleItemSelected = (entity: Entity) => {
    setSelectedItem(entity);
  };

  return (
    <DndContext>
      <div className="relative flex h-screen w-full items-center bg-gray-100 p-2 scrollbar-thin scrollbar-track-transparent overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg overflow-hidden shadow-sm">
          <LeftSidePanel onItemSelected={handleItemSelected} selectedItem={selectedItem} />
          <ResizableHandle withHandle className="bg-slate-200 hover:bg-slate-300 transition-colors w-1" />
          <MainContentPanel entity={selectedItem ?? null} auth={auth} />
          <ResizableHandle withHandle className="bg-slate-200 hover:bg-slate-300 transition-colors w-1" />
          <RightSidePanel entity={selectedItem ?? null} auth={auth} onItemSelected={handleItemSelected} />
        </ResizablePanelGroup>
      </div>
    </DndContext>
  );
};