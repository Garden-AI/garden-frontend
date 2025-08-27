import React, { useEffect, useRef } from "react";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/shadcn/resizable";
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
import { getPanelElement } from "react-resizable-panels";

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

  // Get saved gardens from user's saved DOIs
  const savedGardenDois = userInfo?.saved_garden_dois || [];
  const { data: savedGardensResponse } = useSavedGardens(savedGardenDois);
  const savedGardens = savedGardensResponse?.garden_meta || [];

  const handleGardenCreated = () => {
    refetchGardens();
  };

  // Only show gardens if user is authenticated and has an identity_id
  const filteredGardens = auth.isAuthenticated && userInfo?.identity_id ? gardens || [] : [];

  return (
    <ResizablePanel defaultSize={15} minSize={15} maxSize={75} className="rounded-lg bg-emerald-50">
      <ResizablePanelGroup direction="vertical">
        {/* Saved Gardens Panel */}
        <ResizablePanel id="saved-gardens" defaultSize={33} minSize={10} className="p-2">
          <div className="rounded-lg">
            <SavedGardensPanel
              savedGardens={savedGardens}
              onSelect={onItemSelected}
              selectedItem={selectedItem}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-emerald-200 transition-colors hover:bg-emerald-300"
        />

        {/* My Gardens Panel */}
        <ResizablePanel defaultSize={34} minSize={10} className="p-2">
          <MyGardensPanel
            gardens={filteredGardens}
            onSelect={onItemSelected}
            onGardenCreated={handleGardenCreated}
            selectedItem={selectedItem}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-emerald-200 transition-colors hover:bg-emerald-300"
        />

        {/* My Function Library Panel */}
        <ResizablePanel defaultSize={33} minSize={10} className="p-2">
          <MyFunctionLibraryView
            modelDeployments={modelDeployments || []}
            gardens={filteredGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};
