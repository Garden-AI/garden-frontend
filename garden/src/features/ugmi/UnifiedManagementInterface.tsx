import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { GardenTreeView } from "./GardenTreeView";
import { useGetGardens } from "../gardens/api/useGetGardens";
import { useGetGarden } from "../gardens/api/useGetGarden";
import { useGetModalFunction } from "../modal/api/useGetModalFunction";
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
import ModalAssociatedMaterials from "../materials/components/ModalAssociatedMaterials";
import { MaterialsProvider } from "../materials/contexts/MaterialsContext";
import { ModalFunctionHeader, ModalFunctionBody, ModalFunctionExample } from "../modal/components/ModalFunctionPage";
import { GardenHeader, GardenContentView, GardenPublishModal } from "../gardens/components/shared/GardenComponents";
import TombstonePage from "@/components/TombstonePage";

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
          <LeftSidePanel onItemSelected={hanldeItemSelected} selectedItem={selectedItem} />
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
          <p className="text-gray-500">Select a Garden, Function, or App in the left panel</p>
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
  selectedItem?: Entity | null;
};

const LeftSidePanel = ({ onItemSelected, selectedItem }: LeftSidePanelProps) => {
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
            selectedItem={selectedItem}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={25}>
          <AppTreeView apps={modelDeployments || []} onSelect={onItemSelected} selectedItem={selectedItem} />
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

  // For gardens, fetch fresh data to ensure metadata is up to date
  const gardenEntity = entityType === "garden" ? (entity as Garden) : null;
  const { data: freshGarden } = useGetGarden(gardenEntity?.doi || "");
  const currentGarden = gardenEntity && (freshGarden || gardenEntity);

  // For functions, fetch fresh data to ensure metadata is up to date
  const functionEntity = entityType === "function" ? (entity as ModalFunction) : null;
  const { data: freshModalFunction } = useGetModalFunction(functionEntity?.id.toString() || "");
  const currentModalFunction = functionEntity && (freshModalFunction || functionEntity);

  return (
    <ResizablePanel minSize={20} maxSize={33} className="flex flex-col h-full">
      {entityType === null ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Select a Garden or Function in the left panel</p>
        </div>
      ) : entityType === "function" ? (
        <div className="h-full overflow-y-auto p-4">
          <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
            <FunctionSidebar modalFunction={currentModalFunction!} ownsThisFunction={ownsEntity} />
          </div>
        </div>
      ) : entityType === "garden" ? (
        <div className="h-full overflow-y-auto p-4">
          <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
            <GardenMetadataSidebar garden={currentGarden!} ownsThisGarden={ownsEntity} />
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
  const [isPublishGardenModalOpen, setIsPublishGardenModalOpen] = React.useState(false);

  // Fetch fresh garden data to ensure updates are reflected
  const { data: freshGarden, refetch } = useGetGarden(garden.doi);

  // Use fresh data if available, fallback to prop
  const currentGarden = freshGarden || garden;

  const memoizedRefetch = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Show tombstone page for archived gardens
  if (currentGarden.is_archived) {
    return (
      <div className="h-full overflow-y-auto">
        <TombstonePage garden={currentGarden} />
      </div>
    );
  }

  return (
    <MaterialsProvider garden={currentGarden} refetchGarden={memoizedRefetch}>
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <GardenHeader
            garden={currentGarden}
            ownsThisGarden={ownsThisGarden}
            setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
          />

          <GardenContentView
            garden={currentGarden}
            ownsThisGarden={ownsThisGarden}
          />
        </div>

        <GardenPublishModal
          garden={currentGarden}
          isPublishGardenModalOpen={isPublishGardenModalOpen}
          setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
        />
      </div>
    </MaterialsProvider>
  );
};

const UnifiedFunctionContent = ({ modalFunction, ownsThisFunction }: { modalFunction: ModalFunction, ownsThisFunction: boolean }) => {
  // Fetch fresh modal function data to ensure updates are reflected
  const { data: freshModalFunction } = useGetModalFunction(modalFunction.id.toString());

  // Use fresh data if available, fallback to prop
  const currentModalFunction = freshModalFunction || modalFunction;

  return (
    <div className="h-full overflow-y-auto p-6">
      <ModalFunctionHeader
        modalFunction={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
      <ModalFunctionBody
        modalFunction={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
      <ModalFunctionExample
        modalFunction={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
      <ModalAssociatedMaterials
        resource={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
    </div>
  );
};