import React from "react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { ModelDeploymentDetails } from "../../model-deployments/ModelDeploymentDetails";
import { Garden, ModalFunction, HpcFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { UnifiedGardenContent } from "./UnifiedGardenContent";
import { UnifiedFunctionContent } from "./UnifiedFunctionContent";
import { UnifiedHpcFunctionContent } from "./UnifiedHpcFunctionContent";
import { Entity, matchEntityType } from "../types";

type MainContentPanelProps = {
  entity: Entity | null;
  onAfterDelete?: () => void;
};

export const MainContentPanel = ({ entity, onAfterDelete }: MainContentPanelProps) => {
  const auth = useGlobusAuth();

  const entityType = matchEntityType(entity);
  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity =
    auth?.isAuthenticated &&
    ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub ||
      isSuperUser);

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      {entityType === null || entity === null ? (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-2 text-center">
            <div className="text-4xl">🌿</div>
            <p className="font-medium text-gray-500">Select a Garden or Function from a panel on the left</p>
            <p className="text-sm text-gray-400">or from the Published Gardens panel.</p>
          </div>
        </div>
      ) : (
        <div className="scrollbar-thin scrollbar-track-transparent flex-1 overflow-y-auto">
          {entityType === "modal-function" ? (
            <UnifiedFunctionContent
              modalFunction={entity as ModalFunction}
              ownsThisFunction={ownsEntity}
            />
          ) : entityType === "hpc-function" ? (
            <UnifiedHpcFunctionContent
              hpcFunction={entity as HpcFunction}
              ownsThisFunction={ownsEntity}
              onDeleteSuccess={onAfterDelete}
            />
          ) : entityType === "garden" ? (
            <UnifiedGardenContent garden={entity as Garden} ownsThisGarden={ownsEntity} onAfterDelete={onAfterDelete} />
          ) : (
            <ModelDeploymentDetails entity={(entity as ModelDeployment).originalData} onAfterDelete={onAfterDelete} />
          )}
        </div>
      )}
    </div>
  );
};