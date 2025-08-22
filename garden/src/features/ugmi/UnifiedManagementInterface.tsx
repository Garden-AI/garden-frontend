import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { GardenTreeView } from "./GardenTreeView";
import { useGetGardens } from "../gardens/api/useGetGardens";
import { useGetUserInfo } from "../users/api/useGetUserInfo";
import { DndContext } from "@dnd-kit/core";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import ModalFunctionPage from "../modal/components/ModalFunctionPage";
import { ModelDeploymentDetails } from "../model-deployments/ModelDeploymentDetails";
import { useGetGarden } from "../gardens/api/useGetGarden";

type Entity = Garden | ModalFunction | ModelDeployment;

export const UnifiedManagmentInterface = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const hanldeItemSelected = (entity: Entity) => {
    setSelectedItem(entity);
  };
  return (
    <DndContext>
      <div className="flex h-screen w-screen items-center">
        <ResizablePanelGroup direction="horizontal">
          <LeftSidePanel onItemSelected={hanldeItemSelected} />
          <ResizableHandle withHandle />
          <MainContentPanel entity={selectedItem ?? null} />
          <ResizableHandle withHandle />
          <RightSidePanel />
        </ResizablePanelGroup>
      </div>
    </DndContext>
  );
};

type MainContentPanelProps = {
  entity: Garden | ModalFunction | ModelDeployment | null;
};

const MainContentPanel = ({ entity }: MainContentPanelProps) => {
  const refetchGarden = (garden) => {
    return useGetGarden(garden.doi);
  };

  const entityType = ((entity) => {
    if (entity === null) return null;
    if ("modal_functions" in entity) {
      // it is either a garden or a ModelDeployment
      if ("doi" in entity) {
        return "garden";
      } else {
        return "deployment";
      }
    }
    return "function";
  })(entity);

  return (
    <ResizablePanel minSize={25} defaultSize={66} className="flex items-center justify-center">
      {entityType === null ? (
        <p>Select a Garden, Function, or App</p>
      ) : entityType === "function" ? (
        <ModalFunctionPage />
      ) : entityType === "garden" ? (
        <>{entity.metadata}</>
      ) : (
        <ModelDeploymentDetails entity={entity} />
      )}
    </ResizablePanel>
  );
};

type LeftSidePanelProps = {
  onItemSelected?: (entity: Entity) => void;
};

const LeftSidePanel = ({ onItemSelected }: LeftSidePanelProps) => {
  const { data: userInfo } = useGetUserInfo();
  const { data: gardens } = useGetGardens({ owner_uuid: userInfo?.identity_id });
  return (
    <ResizablePanel minSize={20} maxSize={33}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel minSize={25}>
          <GardenTreeView gardens={gardens || []} onSelect={onItemSelected} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={25} className="flex items-center justify-center">
          Apps
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

const RightSidePanel = () => {
  return (
    <ResizablePanel minSize={20} maxSize={33} className="flex items-center justify-center">
      Right Sidebar
    </ResizablePanel>
  );
};
