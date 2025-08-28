import React, { useRef } from "react";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetUserInfo } from "../../users/api/useGetUserInfo";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { UserInfoPanel } from "./UserInfoPanel";
import { MetadataPanel } from "./MetadataPanel";
import { PublishedGardensPanel } from "./PublishedGardensPanel";

type Entity = Garden | ModalFunction | ModelDeployment;

type RightSidePanelProps = {
  entity: Entity | null;
  onItemSelected?: (entity: Entity) => void;
};

export const RightSidePanel = ({ entity, onItemSelected }: RightSidePanelProps) => {
  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();

  // Panel refs for imperative control
  const metadataPanelRef = useRef<ImperativePanelHandle>(null);
  const publishedGardensPanelRef = useRef<ImperativePanelHandle>(null);

  // Double-click expand handlers
  const handleMetadataExpand = () => {
    const currentSize = metadataPanelRef.current?.getSize() ?? 40;
    if (currentSize > 70) {
      // If already expanded, reset to default sizes
      metadataPanelRef.current?.resize(40);
      publishedGardensPanelRef.current?.resize(60);
    } else {
      // Expand this panel and shrink others
      metadataPanelRef.current?.resize(80);
      publishedGardensPanelRef.current?.resize(20);
    }
  };

  const handlePublishedGardensExpand = () => {
    const currentSize = publishedGardensPanelRef.current?.getSize() ?? 60;
    if (currentSize > 70) {
      // If already expanded, reset to default sizes
      metadataPanelRef.current?.resize(40);
      publishedGardensPanelRef.current?.resize(60);
    } else {
      // Expand this panel and shrink others
      metadataPanelRef.current?.resize(20);
      publishedGardensPanelRef.current?.resize(80);
    }
  };

  return (
    <ResizablePanel
      defaultSize={15}
      minSize={15}
      maxSize={75}
      className="bg-gray-50 flex h-full flex-col rounded-r-lg"
    >
      <UserInfoPanel auth={auth} userInfo={userInfo} />
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Metadata Panel */}
        <ResizablePanel ref={metadataPanelRef} defaultSize={60} minSize={10} className="p-2">
          <MetadataPanel entity={entity} onDoubleClick={handleMetadataExpand} />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-gray-200 hover:bg-gray-300 h-1 transition-colors"
        />

        {/* Published Gardens Panel */}
        <ResizablePanel ref={publishedGardensPanelRef} defaultSize={40} minSize={10} className="p-2">
          <PublishedGardensPanel
            onSelect={onItemSelected}
            selectedItem={entity}
            onDoubleClick={handlePublishedGardensExpand}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};
