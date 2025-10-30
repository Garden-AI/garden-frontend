import React from "react";
import { Library } from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { useGetGarden } from "../../gardens/api/useGetGarden";
import { useGetModalFunction } from "../../functions/modal/api/useGetModalFunction";
import { useGetHpcFunction } from "../../functions/hpc/api/useGetHpcFunction";
import { GardenMetadataSidebar } from "../../gardens/components/GardenMetadataSidebar";
import { FunctionSidebar } from "../../functions/shared/components/FunctionSidebar";
import { Garden, ModalFunction, HpcFunction } from "@/types";
import { GardenFunction } from "../../functions/shared/types/function.types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { Entity, matchEntityType } from "../types";

type MetadataPanelProps = {
    entity: Entity | null;
    onDoubleClick?: () => void;
};

export const MetadataPanel = ({ entity, onDoubleClick }: MetadataPanelProps) => {
    const auth = useGlobusAuth();

    // Determine entity type and get fresh data
    const entityType = matchEntityType(entity);

    // For gardens, fetch fresh data
    const gardenEntity = entityType === "garden" ? (entity as Garden) : null;
    const { data: freshGarden } = useGetGarden(gardenEntity?.doi || "");
    const currentGarden = gardenEntity && (freshGarden || gardenEntity);

    // For modal functions, fetch fresh data
    const modalFunctionEntity = entityType === "modal-function" ? (entity as ModalFunction) : null;
    const { data: freshModalFunction } = useGetModalFunction(modalFunctionEntity?.id.toString() || "");
    const currentModalFunction = modalFunctionEntity && (freshModalFunction || modalFunctionEntity);

    // For HPC functions, fetch fresh data
    const hpcFunctionEntity = entityType === "hpc-function" ? (entity as HpcFunction) : null;
    const { data: freshHpcFunction } = useGetHpcFunction(hpcFunctionEntity?.id.toString() || "");
    const currentHpcFunction = hpcFunctionEntity && (freshHpcFunction || hpcFunctionEntity);

    // Check ownership
    const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
    const ownsEntity = auth?.isAuthenticated &&
        ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

    if (!entity) {
        return (
            <div className="h-full flex flex-col bg-slate-50 rounded-lg">
                <div 
                    className="border-b-2 border-slate-300 bg-slate-100 cursor-pointer"
                    onDoubleClick={onDoubleClick}
                >
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
            <div 
                className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50 rounded-lg cursor-pointer"
                onDoubleClick={onDoubleClick}
            >
                <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
                    <GardenMetadataSidebar garden={currentGarden} ownsThisGarden={ownsEntity} />
                </div>
            </div>
        );
    }

    if (entityType === "modal-function" && currentModalFunction) {
        const gardenFunction: GardenFunction = {
            ...currentModalFunction,
            functionType: 'modal',
        };
        return (
            <div
                className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50 rounded-lg cursor-pointer"
                onDoubleClick={onDoubleClick}
            >
                <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
                    <FunctionSidebar gardenFunction={gardenFunction} ownsThisFunction={ownsEntity} />
                </div>
            </div>
        );
    }

    if (entityType === "hpc-function" && currentHpcFunction) {
        const gardenFunction: GardenFunction = {
            ...currentHpcFunction,
            functionType: 'hpc',
        };
        return (
            <div
                className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50 rounded-lg cursor-pointer"
                onDoubleClick={onDoubleClick}
            >
                <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
                    <FunctionSidebar gardenFunction={gardenFunction} ownsThisFunction={ownsEntity} />
                </div>
            </div>
        );
    }

    // For deployments and other types, show custom header
    return (
        <div className="h-full flex flex-col bg-slate-50 rounded-lg">
            <div 
                className="border-b-2 border-slate-300 bg-slate-100 cursor-pointer"
                onDoubleClick={onDoubleClick}
            >
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
