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
  const [lastExpanded, setLastExpanded] = useState<RefObject<ImperativePanelHandle> | null>(null);

  const auth = useGlobusAuth();
  const { data: userInfo, isLoading: userInfoLoading } = useGetUserInfo();

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

  const handleDeploymentCreated = () => {
    refetchModelDeployments();
  };

  const handlePanelExpand = (selected: RefObject<ImperativePanelHandle>) => {
    if (selected === lastExpanded) {
      // evenly resize the panels, return
      Object.entries(panelRefs).forEach(([_, p]) => p.current?.resize(100 / Object.keys(panelRefs).length));
      setLastExpanded(null);
      return;
    }
    // expand the selected panel, shrink the others
    Object.entries(panelRefs).forEach(([ref, p]) => {
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
            onDoubleClick={() => { handlePanelExpand(panelRefs.functionLibraryPanelRef) }}
            onDeploymentCreated={handleDeploymentCreated}
            isLoading={modelDeploymentsLoading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

