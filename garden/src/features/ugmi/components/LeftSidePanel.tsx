import React, { useRef, useMemo, useEffect } from "react";
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
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { SavedGardensPanel } from "./SavedGardensPanel";
import { MyGardensPanel } from "./MyGardensPanel";
import { MyFunctionLibraryView } from "./MyFunctionLibraryView";

type Entity = Garden | ModalFunction | ModelDeployment;

type LeftSidePanelProps = {
  onItemSelected?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};

export const LeftSidePanel = ({ onItemSelected, selectedItem }: LeftSidePanelProps) => {
  const auth = useGlobusAuth();

  // Stage 1: User info (needed for everything else)
  const { data: userInfo, isLoading: userInfoLoading } = useGetUserInfo();

  // Stage 2: User's gardens (high priority, enabled after userInfo loads)
  const {
    data: gardens,
    isLoading: userGardensLoading,
    refetch: refetchGardens
  } = useGetGardens({
    owner_uuid: userInfo?.identity_id,
  });

  // Stage 3: Saved gardens (enabled after userInfo loads)
  const savedGardenDois = userInfo?.saved_garden_dois || [];
  const {
    data: savedGardensResponse,
    isLoading: savedGardensLoading
  } = useSavedGardens(savedGardenDois);

  // Stage 4: Model deployments (can load in parallel with gardens)
  const {
    data: modelDeployments,
    isLoading: modelDeploymentsLoading,
    refetch: refetchModelDeployments
  } = useGetModelDeployments();

  // Determine if we need to poll for deployment status updates
  const shouldPollDeployments = useMemo(() => {
    return modelDeployments?.some(
      deployment => deployment.originalData?.deploy_status === "pending"
    ) ?? false;
  }, [modelDeployments]);

  // Set up polling for in-progress deployments
  useEffect(() => {
    if (!shouldPollDeployments) return;

    const intervalId = setInterval(() => {
      refetchModelDeployments();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [shouldPollDeployments, refetchModelDeployments]);

  // Panel refs for imperative control
  const savedGardensPanelRef = useRef<ImperativePanelHandle>(null);
  const myGardensPanelRef = useRef<ImperativePanelHandle>(null);
  const functionLibraryPanelRef = useRef<ImperativePanelHandle>(null);

  const savedGardens = savedGardensResponse?.garden_meta || [];

  const handleGardenCreated = () => {
    refetchGardens();
  };

  const handleDeploymentCreated = () => {
    refetchModelDeployments();
  };

  // Double-click expand handlers
  const handleSavedGardensExpand = () => {
    const currentSize = savedGardensPanelRef.current?.getSize() ?? 33;
    if (currentSize > 70) {
      // If already expanded, reset to default sizes
      savedGardensPanelRef.current?.resize(33);
      myGardensPanelRef.current?.resize(34);
      functionLibraryPanelRef.current?.resize(33);
    } else {
      // Expand this panel and shrink others
      savedGardensPanelRef.current?.resize(80);
      myGardensPanelRef.current?.resize(10);
      functionLibraryPanelRef.current?.resize(10);
    }
  };

  const handleMyGardensExpand = () => {
    const currentSize = myGardensPanelRef.current?.getSize() ?? 34;
    if (currentSize > 70) {
      // If already expanded, reset to default sizes
      savedGardensPanelRef.current?.resize(33);
      myGardensPanelRef.current?.resize(34);
      functionLibraryPanelRef.current?.resize(33);
    } else {
      // Expand this panel and shrink others
      savedGardensPanelRef.current?.resize(10);
      myGardensPanelRef.current?.resize(80);
      functionLibraryPanelRef.current?.resize(10);
    }
  };

  const handleFunctionLibraryExpand = () => {
    const currentSize = functionLibraryPanelRef.current?.getSize() ?? 33;
    if (currentSize > 70) {
      // If already expanded, reset to default sizes
      savedGardensPanelRef.current?.resize(33);
      myGardensPanelRef.current?.resize(34);
      functionLibraryPanelRef.current?.resize(33);
    } else {
      // Expand this panel and shrink others
      savedGardensPanelRef.current?.resize(10);
      myGardensPanelRef.current?.resize(10);
      functionLibraryPanelRef.current?.resize(80);
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
          ref={savedGardensPanelRef}
          defaultSize={33}
          minSize={10}
          className="p-2"
        >
          <SavedGardensPanel
            savedGardens={savedGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
            onDoubleClick={handleSavedGardensExpand}
            isLoading={savedGardensLoading}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-gray-200 transition-colors hover:bg-gray-300"
        />

        {/* My Gardens Panel */}
        <ResizablePanel ref={myGardensPanelRef} defaultSize={34} minSize={10} className="p-2">
          <MyGardensPanel
            gardens={filteredGardens}
            onSelect={onItemSelected}
            onGardenCreated={handleGardenCreated}
            selectedItem={selectedItem}
            onDoubleClick={handleMyGardensExpand}
            isLoading={userGardensLoading}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-gray-200 transition-colors hover:bg-gray-300"
        />

        {/* My Function Library Panel */}
        <ResizablePanel ref={functionLibraryPanelRef} defaultSize={33} minSize={10} className="p-2">
          <MyFunctionLibraryView
            modelDeployments={modelDeployments || []}
            gardens={filteredGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
            onDoubleClick={handleFunctionLibraryExpand}
            onDeploymentCreated={handleDeploymentCreated}
            isLoading={modelDeploymentsLoading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

