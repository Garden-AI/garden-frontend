import React from "react";

import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { useGetUserInfo } from "../../users/api/useGetUserInfo";
import { useSavedGardens } from "../../users/api/useSavedGardens";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { Garden } from "@/types";
import { SavedGardensPanel } from "./SavedGardensPanel";
import { MyGardensPanel } from "./MyGardensPanel";
import { MyFunctionLibraryView } from "./MyFunctionLibraryView";
import { Entity } from "../types";
import { useSelection } from "../hooks";
import { usePanelExpansion, createPanelRefs } from "../hooks/usePanelExpansion";

type LeftSidePanelProps = {
  onItemSelected?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
  selectedItem?: Entity | null;
  selection: ReturnType<typeof useSelection>;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
};

export const LeftSidePanel = ({ onItemSelected, selectedItem, selection, onDeploymentCreated }: LeftSidePanelProps) => {

  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();

  const {
    data: gardens,
    isLoading: userGardensLoading,
    refetch: refetchGardens
  } = useGetGardens({
    owner_uuid: userInfo?.identity_id,
  }, {
    enabled: !!userInfo?.identity_id,
  });

  const savedGardenDois = userInfo?.saved_garden_dois || [];
  const {
    data: savedGardensResponse,
    isLoading: savedGardensLoading
  } = useSavedGardens(savedGardenDois);


  // Panel refs for imperative control
  const panelRefs = createPanelRefs(['savedGardensPanelRef', 'myGardensPanelRef', 'functionLibraryPanelRef'] as const);
  const { handlePanelExpand } = usePanelExpansion(panelRefs);

  const savedGardens = (savedGardensResponse?.garden_meta || []) as Garden[];

  const handleGardenCreated = () => {
    refetchGardens();
  };

  const handleDeploymentCreatedLocal = (deployment: ModelDeployment) => {
    // Cache invalidation already happened in useModalAppForm
    // Just handle the selection logic

    // Immediately select the deployment object and pass it up
    if (onDeploymentCreated) {
      onDeploymentCreated(deployment);
    }

    // Also select it in the current panel
    if (onItemSelected) {
      onItemSelected(deployment);
    }
  };


  // Only show gardens if user is authenticated and has an identity_id
  const filteredGardens = auth.isAuthenticated && userInfo?.identity_id ? gardens || [] : [];

  return (
    <ResizablePanel defaultSize={15} minSize={15} maxSize={75} className="rounded-lg bg-gray-50">
      <ResizablePanelGroup direction="vertical">
        {/* Saved Gardens Panel */}
        <ResizablePanel
          id="saved-gardens"
          ref={panelRefs.savedGardensPanelRef}
          defaultSize={33}
          minSize={10}
          className="p-2"
        >
          <SavedGardensPanel
            savedGardens={savedGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
            selection={selection}
            onDoubleClick={() => handlePanelExpand(panelRefs.savedGardensPanelRef)}
            isLoading={savedGardensLoading}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-gray-200 transition-colors hover:bg-gray-300"
        />

        {/* My Gardens Panel */}
        <ResizablePanel ref={panelRefs.myGardensPanelRef} defaultSize={34} minSize={10} className="p-2">
          <MyGardensPanel
            gardens={filteredGardens}
            onSelect={onItemSelected}
            onGardenCreated={handleGardenCreated}
            selectedItem={selectedItem}
            selection={selection}
            onDoubleClick={() => handlePanelExpand(panelRefs.myGardensPanelRef)}
            isLoading={userGardensLoading}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-gray-200 transition-colors hover:bg-gray-300"
        />

        {/* My Function Library Panel */}
        <ResizablePanel ref={panelRefs.functionLibraryPanelRef} defaultSize={33} minSize={10} className="p-2">
          <MyFunctionLibraryView
            gardens={filteredGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
            selection={selection}
            onDoubleClick={() => { handlePanelExpand(panelRefs.functionLibraryPanelRef) }}
            onDeploymentCreated={handleDeploymentCreatedLocal}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

