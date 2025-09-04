import React, { RefObject, useRef, useState } from "react";
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
import { useSelection } from "../hooks";
import { Entity } from "../types";

type RightSidePanelProps = {
  entity: Entity | null;
  onItemSelected?: (entity: Entity) => void;
  selection?: ReturnType<typeof useSelection>;
};

export const RightSidePanel = ({ entity, onItemSelected, selection }: RightSidePanelProps) => {
  const [lastExpanded, setLastExpanded] = useState(null);

  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();

  // Panel refs for imperative control
  const panelRefs = {
    metadataPanelRef: useRef<ImperativePanelHandle>(null),
    publishedGardensPanelRef: useRef<ImperativePanelHandle>(null),
  };

  const handlePanelExpand = (selected: RefObject<ImperativePanelHandle>) => {
    if (selected === lastExpanded) {
      // evenly space the panels, return
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
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

