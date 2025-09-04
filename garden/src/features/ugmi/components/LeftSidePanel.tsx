import React, { useRef, useMemo, useEffect, useState, RefObject } from "react";

import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { useGetModelDeployments } from "../../model-deployments/api/useGetModelDeployments";
import { useGetUserInfo } from "../../users/api/useGetUserInfo";
import { useSavedGardens } from "../../users/api/useSavedGardens";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { Garden } from "@/types";
import { SavedGardensPanel } from "./SavedGardensPanel";
import { MyGardensPanel } from "./MyGardensPanel";
import { MyFunctionLibraryView } from "./MyFunctionLibraryView";
import { Entity } from "../types";
import { useSelection } from "../hooks";

type LeftSidePanelProps = {
  onItemSelected?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
  selectedItem?: Entity | null;
  selection: ReturnType<typeof useSelection>;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
  onGardenSaved?: (garden: Garden) => void;
};

export const LeftSidePanel = ({ onItemSelected, selectedItem, selection, onDeploymentCreated, onGardenSaved }: LeftSidePanelProps) => {
  const [lastExpanded, setLastExpanded] = useState<RefObject<ImperativePanelHandle> | null>(null);

  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();

  const {
    data: gardens,
    isLoading: userGardensLoading,
    refetch: refetchGardens
  } = useGetGardens({
    owner_uuid: userInfo?.identity_id,
  });

  const savedGardenDois = userInfo?.saved_garden_dois || [];
  const {
    data: savedGardensResponse,
    isLoading: savedGardensLoading
  } = useSavedGardens(savedGardenDois);

  const {
    data: modelDeployments,
    isLoading: modelDeploymentsLoading,
    refetch: refetchModelDeployments
  } = useGetModelDeployments();

  const shouldPollDeployments = useMemo(() => {
    return modelDeployments?.some(
      deployment => deployment.originalData?.deploy_status === "pending"
    ) ?? false;
  }, [modelDeployments]);

  useEffect(() => {
    if (!shouldPollDeployments) return;

    const intervalId = setInterval(() => {
      refetchModelDeployments();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [shouldPollDeployments, refetchModelDeployments]);

  // Panel refs for imperative control
  const panelRefs = {
    savedGardensPanelRef: useRef<ImperativePanelHandle>(null),
    myGardensPanelRef: useRef<ImperativePanelHandle>(null),
    functionLibraryPanelRef: useRef<ImperativePanelHandle>(null),
  };

  const savedGardens = savedGardensResponse?.garden_meta || [];

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

  const handlePanelExpand = (selected: RefObject<ImperativePanelHandle>) => {
    if (selected === lastExpanded) {
      // evenly resize the panels, return
      Object.values(panelRefs).forEach(p => p.current?.resize(100 / Object.keys(panelRefs).length));
      setLastExpanded(null);
      return;
    }
    // expand the selected panel, shrink the others
    Object.values(panelRefs).forEach(p => {
      if (p === selected) {
        p.current?.resize(80);
        setLastExpanded(p);
        return;
      } else {
        p.current?.resize(10);
      }
    });
  }

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
            onGardenSaved={onGardenSaved}
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
            modelDeployments={modelDeployments || []}
            gardens={filteredGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
            selection={selection}
            onDoubleClick={() => { handlePanelExpand(panelRefs.functionLibraryPanelRef) }}
            onDeploymentCreated={handleDeploymentCreatedLocal}
            isLoading={modelDeploymentsLoading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

