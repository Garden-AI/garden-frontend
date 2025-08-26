import React from "react";
import { ResizablePanel } from "@/components/shadcn/resizable";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { useGetGarden } from "../../gardens/api/useGetGarden";
import { useGetModalFunction } from "../../modal/api/useGetModalFunction";
import { ModelDeploymentDetails } from "../../model-deployments/ModelDeploymentDetails";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { UnifiedGardenContent } from "./UnifiedGardenContent";
import { UnifiedFunctionContent } from "./UnifiedFunctionContent";

type Entity = Garden | ModalFunction | ModelDeployment;

type MainContentPanelProps = {
    entity: Garden | ModalFunction | ModelDeployment | null;
    auth: ReturnType<typeof useGlobusAuth>;
};

export const MainContentPanel = ({ entity, auth }: MainContentPanelProps) => {
    const entityType = ((entity) => {
        if (entity === null) return null;

        // Check if it's a Garden (has doi and modal_functions)
        if ("doi" in entity && "modal_functions" in entity) {
            return "garden";
        }

        // Check if it's a ModelDeployment (has originalData property)
        if ("originalData" in entity && "status" in entity) {
            return "deployment";
        }

        // Check if it's a ModalFunction (has function_name or title, and id)
        if (("function_name" in entity || "title" in entity) && "id" in entity) {
            return "function";
        }

        // Fallback - shouldn't happen
        return null;
    })(entity);

    const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
    const ownsEntity =
        auth?.isAuthenticated &&
        ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub ||
            isSuperUser);

    return (
        <ResizablePanel minSize={25} defaultSize={40} className="flex flex-col bg-white">
            {entityType === null ? (
                <div className="flex h-full items-center justify-center">
                    <div className="text-center space-y-2">
                        <div className="text-4xl">🌿</div>
                        <p className="text-gray-500 font-medium">Select a Garden, Function, or App</p>
                        <p className="text-sm text-gray-400">Choose from the left panel to get started</p>
                    </div>
                </div>
            ) : (
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent">
                    {entityType === "function" ? (
                        <UnifiedFunctionContent
                            modalFunction={entity as ModalFunction}
                            ownsThisFunction={ownsEntity}
                        />
                    ) : entityType === "garden" ? (
                        <UnifiedGardenContent garden={entity as Garden} ownsThisGarden={ownsEntity} />
                    ) : entityType === "deployment" ? (
                        <ModelDeploymentDetails entity={(entity as ModelDeployment).originalData} />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500">Unknown entity type</p>
                        </div>
                    )}
                </div>
            )}
        </ResizablePanel>
    );
};
