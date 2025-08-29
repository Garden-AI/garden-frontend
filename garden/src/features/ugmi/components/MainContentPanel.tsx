import React from "react";
import { ResizablePanel } from "@/components/shadcn/resizable";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { ModelDeploymentDetails } from "../../model-deployments/ModelDeploymentDetails";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { UnifiedGardenContent } from "./UnifiedGardenContent";
import { UnifiedFunctionContent } from "./UnifiedFunctionContent";
import { Entity, matchEntityType } from "../types";

type MainContentPanelProps = {
  entity: Entity | null;
};

export const MainContentPanel = ({ entity }: MainContentPanelProps) => {
  const auth = useGlobusAuth();

  const entityType = matchEntityType(entity);
  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity =
    auth?.isAuthenticated &&
    ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub ||
      isSuperUser);

  return (
    <ResizablePanel minSize={25} defaultSize={40} className="flex flex-col bg-white">
      {entityType === null ? (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-2 text-center">
            <div className="text-4xl">🌿</div>
            <p className="font-medium text-gray-500">Select a Garden or Function from a panel on the left</p>
            <p className="text-sm text-gray-400">or from the Published Gardens panel.</p>
          </div>
        </div>
      ) : (
        <div className="scrollbar-thin scrollbar-track-transparent h-full overflow-y-auto">
          {entityType === "function" ? (
            <UnifiedFunctionContent
              modalFunction={entity as ModalFunction}
              ownsThisFunction={ownsEntity}
            />
          ) : entityType === "garden" ? (
            <UnifiedGardenContent garden={entity as Garden} ownsThisGarden={ownsEntity} />
          ) : (
            <ModelDeploymentDetails entity={(entity as ModelDeployment).originalData} />
          )}
        </div>
      )}
    </ResizablePanel>
  );
};

