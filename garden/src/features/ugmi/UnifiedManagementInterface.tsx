import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { GardenTreeView } from "./GardenTreeView";
import { useGetGardens } from "../gardens/api/useGetGardens";
import { useGetUserInfo } from "../users/api/useGetUserInfo";
import { useGetModelDeployments } from "../model-deployments/api/useGetModelDeployments";
import { AppTreeView } from "./AppTreeView";
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
  auth: ReturnType<typeof useGlobusAuth>;
};

const MainContentPanel = ({ entity, auth }: MainContentPanelProps) => {
  const entityType = ((entity) => {
    if (entity === null) return null;

    // Check if it's a Garden (has doi and modal_functions)
    if ("doi" in entity && "modal_functions" in entity) {
      return "garden";
    }

    // Check if it's a ModelDeployment (has originalData property)
    if ("originalData" in entity && "status" in entity) {
      return "deployment";
    }

    // Check if it's a ModalFunction (has function_name or title, and id)
    if (("function_name" in entity || "title" in entity) && "id" in entity) {
      return "function";
    }

    // Fallback - shouldn't happen
    return null;
  })(entity);

  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity = auth?.isAuthenticated && ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

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
        <div className="h-full overflow-y-auto">
          <ModelDeploymentDetails entity={(entity as ModelDeployment).originalData} />
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
  const { data: gardens, refetch: refetchGardens } = useGetGardens({ owner_uuid: userInfo?.identity_id });
  const { data: modelDeployments } = useGetModelDeployments();

  const handleGardenCreated = () => {
    refetchGardens();
  };

  return (
    <ResizablePanel minSize={20} maxSize={33}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel minSize={25}>
          <GardenTreeView
            gardens={gardens || []}
            onSelect={onItemSelected}
            onGardenCreated={handleGardenCreated}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={25}>
          <AppTreeView apps={modelDeployments || []} onSelect={onItemSelected} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

const RightSidePanel = ({ entity, auth }: { entity: Entity | null, auth: ReturnType<typeof useGlobusAuth> }) => {
  const entityType = ((entity) => {
    if (entity === null) return null;

    // Check if it's a Garden (has doi and modal_functions)
    if ("doi" in entity && "modal_functions" in entity) {
      return "garden";
    }

    // Check if it's a ModelDeployment (has originalData property)
    if ("originalData" in entity && "status" in entity) {
      return "deployment";
    }

    // Check if it's a ModalFunction (has function_name or title, and id)
    if (("function_name" in entity || "title" in entity) && "id" in entity) {
      return "function";
    }

    // Fallback - shouldn't happen
    return null;
  })(entity);

  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity = auth?.isAuthenticated && ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

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
          <p className="text-gray-500">App details shown in main panel</p>
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
        modalFunction={modalFunction}
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