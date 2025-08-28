import React, { useRef } from "react";
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
  const { data: userInfo } = useGetUserInfo();
  const { data: gardens, refetch: refetchGardens } = useGetGardens({
    owner_uuid: userInfo?.identity_id,
  });
  const { data: modelDeployments } = useGetModelDeployments();

  // Panel refs for imperative control
  const savedGardensPanelRef = useRef<ImperativePanelHandle>(null);
  const myGardensPanelRef = useRef<ImperativePanelHandle>(null);
  const functionLibraryPanelRef = useRef<ImperativePanelHandle>(null);

  // Get saved gardens from user's saved DOIs
  const savedGardenDois = userInfo?.saved_garden_dois || [];
  const { data: savedGardensResponse } = useSavedGardens(savedGardenDois);
  const savedGardens = savedGardensResponse?.garden_meta || [];

  const handleGardenCreated = () => {
    refetchGardens();
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
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};
