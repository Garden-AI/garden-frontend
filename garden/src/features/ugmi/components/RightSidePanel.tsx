import React from "react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/shadcn/resizable";
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
    auth: ReturnType<typeof useGlobusAuth>;
    onItemSelected?: (entity: Entity) => void;
};

export const RightSidePanel = ({
    entity,
    auth,
    onItemSelected,
}: RightSidePanelProps) => {
    const { data: userInfo } = useGetUserInfo();

    return (
        <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="flex h-full flex-col bg-green-50 rounded-r-lg">
            <UserInfoPanel auth={auth} userInfo={userInfo} />
            <ResizablePanelGroup direction="vertical" className="flex-1">
                {/* Metadata Panel */}
                <ResizablePanel defaultSize={40} minSize={20}>
                    <MetadataPanel entity={entity} />
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-green-200 hover:bg-green-300 transition-colors h-1" />

                {/* Published Gardens Panel */}
                <ResizablePanel defaultSize={60} minSize={30}>
                    <PublishedGardensPanel
                        onSelect={onItemSelected}
                        selectedItem={entity}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    );
};
