import { Garden, ModalFunction } from "@/types";
import { GardenFunction } from "../functions/shared/types/function.types";
import { ModelDeployment } from "@/features/model-deployments/ModelDeployments";

export type Entity = Garden | ModalFunction | ModelDeployment | GardenFunction;

export type EntityType = "garden" | "deployment" | "function";

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

    // Check if it's a ModalFunction (has function_name or title, and id)
    if (("function_name" in entity || "title" in entity) && "id" in entity) {
        return "function";
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
        case "function":
            return `function-${(entity as ModalFunction).id}`;
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
        case "function":
            return (entity as ModalFunction).function_name || "Unknown Function";
        default:
            return "Unknown Entity";
    }
};

export const getFunctionsFromEntity = (entity: Entity): ModalFunction[] => {
    const type = matchEntityType(entity);
    switch (type) {
        case "garden":
            return (entity as Garden).modal_functions || [];
        case "deployment":
            return (entity as ModelDeployment).originalData?.modal_functions || [];
        case "function":
            return [entity as ModalFunction];
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