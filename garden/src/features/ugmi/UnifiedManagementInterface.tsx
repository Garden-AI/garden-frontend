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
import { ModelDeploymentDetails } from "../model-deployments/ModelDeploymentDetails";
import { GardenMetadataSidebar } from "../gardens/components/GardenMetadataSidebar";
import { FunctionSidebar } from "../modal/components/FunctionSidebar";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { GardenDescription } from "../gardens/components/garden-page";
import { GardenTabbedSection } from "../gardens/components/GardenTabbedSection";
import ModalAssociatedMaterials from "../materials/components/ModalAssociatedMaterials";
import { MaterialsProvider } from "../materials/contexts/MaterialsContext";
import { ModalFunctionHeader, ModalFunctionBody, ModalFunctionExample } from "../modal/components/ModalFunctionPage";

type Entity = Garden | ModalFunction | ModelDeployment;

export const UnifiedManagmentInterface = () => {
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const auth = useGlobusAuth();

  const hanldeItemSelected = (entity: Entity) => {
    setSelectedItem(entity);
  };
  return (
    <DndContext>
      <div className="flex h-screen w-screen items-center">
        <ResizablePanelGroup direction="horizontal">
          <LeftSidePanel onItemSelected={hanldeItemSelected} />
          <ResizableHandle withHandle />
          <MainContentPanel entity={selectedItem ?? null} auth={auth} />
          <ResizableHandle withHandle />
          <RightSidePanel entity={selectedItem ?? null} auth={auth} />
        </ResizablePanelGroup>
      </div>
    </DndContext>
  );
};

type MainContentPanelProps = {
  entity: Garden | ModalFunction | ModelDeployment | null;
  auth: any;
};

const MainContentPanel = ({ entity, auth }: MainContentPanelProps) => {
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

  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity = auth?.isAuthenticated && ((entity as any)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

  return (
    <ResizablePanel minSize={25} defaultSize={50} className="flex flex-col">
      {entityType === null ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Select a Garden, Function, or App</p>
        </div>
      ) : entityType === "function" ? (
        <UnifiedFunctionContent modalFunction={entity as ModalFunction} ownsThisFunction={ownsEntity} />
      ) : entityType === "garden" ? (
        <UnifiedGardenContent garden={entity as Garden} ownsThisGarden={ownsEntity} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">App details coming soon</p>
        </div>
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

const RightSidePanel = ({ entity, auth }: { entity: Entity | null, auth: any }) => {
  const entityType = ((entity) => {
    if (entity === null) return null;
    if ("modal_functions" in entity) {
      if ("doi" in entity) {
        return "garden";
      } else {
        return "deployment";
      }
    }
    return "function";
  })(entity);

  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity = auth?.isAuthenticated && ((entity as any)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

  return (
    <ResizablePanel minSize={20} maxSize={33} className="flex flex-col h-full">
      {entityType === null ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Metadata will appear here</p>
        </div>
      ) : entityType === "function" ? (
        <div className="h-full overflow-y-auto p-4">
          <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
            <FunctionSidebar modalFunction={entity as ModalFunction} ownsThisFunction={ownsEntity} />
          </div>
        </div>
      ) : entityType === "garden" ? (
        <div className="h-full overflow-y-auto p-4">
          <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
            <GardenMetadataSidebar garden={entity as Garden} ownsThisGarden={ownsEntity} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Deployment metadata</p>
        </div>
      )}
    </ResizablePanel>
  );
};

// Unified content components without sidebars
const UnifiedGardenContent = ({ garden, ownsThisGarden }: { garden: Garden, ownsThisGarden: boolean }) => {
  return (
    <MaterialsProvider garden={garden} refetchGarden={() => Promise.resolve()}>
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{garden.title}</h1>
          <GardenDescription garden={garden} ownsThisGarden={ownsThisGarden} />
        </div>
        
        <div className="mt-6">
          <GardenTabbedSection
            garden={garden}
            ownsThisGarden={ownsThisGarden}
          />
        </div>
      </div>
    </MaterialsProvider>
  );
};

const UnifiedFunctionContent = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunction, ownsThisFunction: boolean }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <ModalFunctionHeader 
        modalFunction={modalFunction as any} 
        ownsThisFunction={ownsThisFunction} 
      />
      <ModalFunctionBody 
        modalFunction={modalFunction} 
        ownsThisFunction={ownsThisFunction} 
      />
      <ModalFunctionExample 
        modalFunction={modalFunction} 
        ownsThisFunction={ownsThisFunction} 
      />
      <ModalAssociatedMaterials
        resource={modalFunction}
        ownsThisFunction={ownsThisFunction}
      />
    </div>
  );
};