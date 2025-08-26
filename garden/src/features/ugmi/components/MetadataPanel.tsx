import React from "react";
import { Library } from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { useGetGarden } from "../../gardens/api/useGetGarden";
import { useGetModalFunction } from "../../modal/api/useGetModalFunction";
import { GardenMetadataSidebar } from "../../gardens/components/GardenMetadataSidebar";
import { FunctionSidebar } from "../../modal/components/FunctionSidebar";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

type Entity = Garden | ModalFunction | ModelDeployment;

type MetadataPanelProps = {
    entity: Entity | null;
};

export const MetadataPanel = ({ entity }: MetadataPanelProps) => {
    const auth = useGlobusAuth();

    // Determine entity type and get fresh data
    const entityType = (() => {
        if (entity === null) return;
        if ("doi" in entity && "modal_functions" in entity) return "garden";
        if ("originalData" in entity && "status" in entity) return "deployment";
        if (("function_name" in entity || "title" in entity) && "id" in entity) return "function";
        return null;
    })();

    // For gardens, fetch fresh data
    const gardenEntity = entityType === "garden" ? (entity as Garden) : null;
    const { data: freshGarden } = useGetGarden(gardenEntity?.doi || "");
    const currentGarden = gardenEntity && (freshGarden || gardenEntity);

    // For functions, fetch fresh data
    const functionEntity = entityType === "function" ? (entity as ModalFunction) : null;
    const { data: freshModalFunction } = useGetModalFunction(functionEntity?.id.toString() || "");
    const currentModalFunction = functionEntity && (freshModalFunction || functionEntity);

    // Check ownership
    const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
    const ownsEntity = auth?.isAuthenticated &&
        ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

    if (!entity) {
        return (
            <div className="h-full flex flex-col bg-slate-50">
                <div className="border-b-2 border-slate-300 bg-slate-100">
                    <div className="px-4 py-2">
                        <div className="flex items-center gap-2">
                            <Library className="h-4 w-4 text-slate-700" />
                            <h2 className="text-sm font-semibold text-slate-900">Metadata</h2>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center space-y-2">
                        <Library className="h-8 w-8 text-slate-300 mx-auto" />
                        <p className="text-sm text-slate-500">Select an item to view metadata</p>
                    </div>
                </div>
            </div>
        );
    }

    // For garden and function metadata, don't show custom header since components have their own
    if (entityType === "garden" && currentGarden) {
        return (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50">
                <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
                    <GardenMetadataSidebar garden={currentGarden} ownsThisGarden={ownsEntity} />
                </div>
            </div>
        );
    }

    if (entityType === "function" && currentModalFunction) {
        return (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50">
                <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
                    <FunctionSidebar modalFunction={currentModalFunction} ownsThisFunction={ownsEntity} />
                </div>
            </div>
        );
    }

    // For deployments and other types, show custom header
    return (
        <div className="h-full flex flex-col bg-slate-50">
            <div className="border-b-2 border-slate-300 bg-slate-100">
                <div className="px-4 py-2">
                    <div className="flex items-center gap-2">
                        <Library className="h-4 w-4 text-slate-700" />
                        <h2 className="text-sm font-semibold text-slate-900">Deployment Details</h2>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3">
                {entityType === "deployment" ? (
                    <div className="text-sm">
                        <h3 className="font-semibold mb-2">Deployment Information</h3>
                        <p className="text-slate-600">App: {(entity as ModelDeployment).name}</p>
                        <p className="text-slate-600">Status: {(entity as ModelDeployment).status}</p>
                        <p className="text-slate-600">Type: {(entity as ModelDeployment).type}</p>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 text-sm">
                        Unable to load metadata
                    </div>
                )}
            </div>
        </div>
    );
};
