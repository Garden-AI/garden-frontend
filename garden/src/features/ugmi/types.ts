import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";

export type Entity = Garden | ModalFunction | ModelDeployment;

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

// Helper functions for react-arborist node IDs
export const buildGardenNodeId = (garden: Garden): string => `garden-${garden.doi}`;

export const buildFunctionNodeId = (func: ModalFunction, gardenDoi?: string): string => {
    if (gardenDoi) {
        return `function-${func.id}-garden-${gardenDoi}`;
    }
    return `function-${func.id}`;
};

export const buildDeploymentNodeId = (deployment: ModelDeployment): string => 
    `deployment-${deployment.originalData?.id || 'unknown'}`;

// Convert an entity to its corresponding tree node ID
export const entityToNodeId = (entity: Entity, contextGarden?: Garden): string | undefined => {
    if (isGarden(entity)) {
        return buildGardenNodeId(entity);
    } else if (isFunction(entity)) {
        return buildFunctionNodeId(entity, contextGarden?.doi);
    } else if (isDeployment(entity)) {
        return buildDeploymentNodeId(entity);
    }
    return undefined;
};

// Tree data builders for react-arborist
export interface TreeNodeData {
    id: string;
    name: string;
    garden?: Garden;
    func?: ModalFunction;
    deployment?: ModelDeployment;
    children?: TreeNodeData[];
}

export const buildGardenTreeData = (gardens: Garden[]): TreeNodeData[] => {
    return gardens?.map((garden) => ({
        id: buildGardenNodeId(garden),
        name: garden.title,
        garden: garden,
        children: garden.modal_functions?.map((func) => ({
            id: buildFunctionNodeId(func, garden.doi),
            name: func.title,
            func: func,
        }))
    })) || [];
};

export const buildFunctionTreeData = (functions: ModalFunction[]): TreeNodeData[] => {
    return functions?.map((func) => ({
        id: buildFunctionNodeId(func),
        name: func.title || func.function_name,
        func: func,
    })) || [];
};

export const buildDeploymentTreeData = (deployments: ModelDeployment[]): TreeNodeData[] => {
    return deployments?.map((deployment) => ({
        id: buildDeploymentNodeId(deployment),
        name: deployment.name,
        deployment: deployment,
    })) || [];
};