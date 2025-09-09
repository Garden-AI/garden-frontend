import React from "react";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetUserInfo } from "../../users/api/useGetUserInfo";
import { UserInfoPanel } from "./UserInfoPanel";
import { MetadataPanel } from "./MetadataPanel";
import { PublishedGardensPanel } from "./PublishedGardensPanel";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { usePanelExpansion, createPanelRefs } from "../hooks/usePanelExpansion";
import { DragAndDropState } from "../hooks/useDragDrop";

type RightSidePanelProps = {
  entity: Entity | null;
  onItemSelected?: (entity: Entity) => void;
  selection?: ReturnType<typeof useSelection>;
  dragAndDrop: DragAndDropState;
};

export const RightSidePanel = ({ entity, onItemSelected, selection, dragAndDrop }: RightSidePanelProps) => {
  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();

  // Panel refs for imperative control
  const panelRefs = createPanelRefs(['metadataPanelRef', 'publishedGardensPanelRef'] as const);
  const { handlePanelExpand } = usePanelExpansion(panelRefs);

  return (
    <ResizablePanel
      defaultSize={15}
      minSize={15}
      maxSize={75}
      className="flex h-full flex-col rounded-r-lg bg-gray-50"
    >
      <UserInfoPanel auth={auth} userInfo={userInfo} />
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Metadata Panel */}
        <ResizablePanel ref={panelRefs.metadataPanelRef} defaultSize={60} minSize={10} className="p-2">
          <MetadataPanel entity={entity} onDoubleClick={() => handlePanelExpand(panelRefs.metadataPanelRef)} />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="h-1 bg-gray-200 transition-colors hover:bg-gray-300"
        />

        {/* Published Gardens Panel */}
        <ResizablePanel
          ref={panelRefs.publishedGardensPanelRef}
          defaultSize={40}
          minSize={10}
          className="p-2"
        >
          <PublishedGardensPanel
            onSelect={onItemSelected}
            selectedItem={entity}
            selection={selection}
            onDoubleClick={() => handlePanelExpand(panelRefs.publishedGardensPanelRef)}
            dragAndDrop={dragAndDrop}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

