import { Garden, ModalFunction, HpcFunction } from "@/types";
import { components } from "@/types/backend-schema";
import { GardenFunction } from "../functions/shared/types/function.types";
import { ModelDeployment } from "@/features/model-deployments/ModelDeployments";

export type Entity = Garden | ModalFunction | ModelDeployment | GardenFunction | HpcFunction;

export type EntityType = "garden" | "deployment" | "modal-function" | "hpc-function";

// Click event type for UI interactions
export type ClickEvent = { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean };

export const matchEntityType = (entity: Entity | null): EntityType | null => {
    if (entity === null) return null;

    // Check if it's a Garden (has doi and modal_functions)
    if ("doi" in entity && "modal_functions" in entity) {
        return "garden";
    }

    // Check if it's a ModelDeployment (has originalData property)
    if ("originalData" in entity && "status" in entity) {
        return "deployment";
    }

    // Check functionType discriminator for functions
    if ("functionType" in entity) {
        if (entity.functionType === "hpc") {
            return "hpc-function";
        }
        if (entity.functionType === "modal") {
            return "modal-function";
        }
    }

    // Fallback - shouldn't happen
    return null;
};

// Utility functions for entity operations
export const getEntityId = (entity: Entity): string => {
    const type = matchEntityType(entity);
    switch (type) {
        case "garden":
            return `garden-${(entity as Garden).doi}`;
        case "deployment":
            return `deployment-${(entity as ModelDeployment).originalData?.id || 'unknown'}`;
        case "modal-function":
            return `modal-function-${(entity as ModalFunction).id}`;
        case "hpc-function":
            return `hpc-function-${(entity as HpcFunction).id}`;
        default:
            return "unknown";
    }
};

export const getEntityDisplayName = (entity: Entity): string => {
    const type = matchEntityType(entity);
    switch (type) {
        case "garden":
            return (entity as Garden).title;
        case "deployment":
            return (entity as ModelDeployment).name;
        case "modal-function":
            return (entity as ModalFunction).function_name || (entity as ModalFunction).title || "Unknown Function";
        case "hpc-function":
            return (entity as HpcFunction).title || (entity as HpcFunction).function_name || "Unknown Function";
        default:
            return "Unknown Entity";
    }
};

export const getFunctionsFromEntity = (entity: Entity): ModalFunction[] => {
    const type = matchEntityType(entity);
    switch (type) {
        case "garden":
            return (entity as Garden).modal_functions?.map(func => ({ ...func, functionType: 'modal' })) || [];
        case "deployment":
            return (entity as ModelDeployment).originalData?.modal_functions?.map((func: components["schemas"]["ModalFunctionMetadataResponse"]) => ({ ...func, functionType: 'modal' })) || [];
        case "modal-function":
            return [{ ...(entity as ModalFunction), functionType: 'modal' }];
        case "hpc-function":
            // HPC functions don't have modal functions
            return [];
        default:
            return [];
    }
};


// Type guards
export const isGarden = (entity: Entity): entity is Garden =>
    matchEntityType(entity) === "garden";

export const isDeployment = (entity: Entity): entity is ModelDeployment =>
    matchEntityType(entity) === "deployment";

export const isFunction = (entity: Entity): entity is ModalFunction =>
    matchEntityType(entity) === "function";

export const isHpcFunction = (entity: Entity): entity is HpcFunction =>
    "functionType" in entity && entity.functionType === "hpc";

export const isModalFunction = (entity: Entity): entity is ModalFunction =>
    "functionType" in entity && entity.functionType === "modal";