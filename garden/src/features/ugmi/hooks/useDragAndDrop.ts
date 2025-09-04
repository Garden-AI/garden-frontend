import { useState, useCallback } from "react";
import { DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { toast } from "sonner";
import { Entity, getEntityDisplayName, isGarden, isFunction } from "../types";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

export function useDragAndDrop(
    userGardens: Garden[] = [],
    modelDeployments: ModelDeployment[] = [],
    userIdentityId?: string,
    onFunctionsAddedToGarden?: (functions: ModalFunction[], garden: Garden) => void,
    onGardenSaved?: (garden: Garden) => void,
    allGardens: Garden[] = [] // All gardens for dragging (includes user gardens + published gardens)
) {
    const [draggedEntities, setDraggedEntities] = useState<Entity[]>([]);
    const [dropTargetGarden, setDropTargetGarden] = useState<Garden | null>(null);

    // Configure drag sensors
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 10 },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    // Helper to get all functions from entities
    const getFunctionsFromEntities = useCallback((entities: Entity[]): ModalFunction[] => {
        const functions: ModalFunction[] = [];

        for (const entity of entities) {
            if (isFunction(entity)) {
                functions.push(entity as ModalFunction);
            } else if (isGarden(entity)) {
                const garden = entity as Garden;
                if (garden.modal_functions) {
                    functions.push(...garden.modal_functions);
                }
            } else {
                // ModelDeployment
                const deployment = entity as ModelDeployment;
                if (deployment.originalData?.modal_functions) {
                    functions.push(...deployment.originalData.modal_functions);
                }
            }
        }

        return functions;
    }, []);

    // Helper to find target garden from drop ID
    const findTargetGarden = useCallback((dropId: string): Garden | null => {
        // Handle both "garden-{doi}" and just "{doi}" formats
        const gardenDoi = dropId.startsWith('garden-') ? dropId.replace('garden-', '') : dropId;
        return userGardens.find(g => g.doi === gardenDoi) || null;
    }, [userGardens]);

    const handleDragStart = useCallback((event: unknown, selectedEntities: Entity[] = []) => {
        const dragEvent = event as { active: { id: string } };
        const activeId = dragEvent.active.id;

        // Find the dragged entity
        let draggedEntity: Entity | null = null;

        // Parse the ID to find the entity
        if (activeId.startsWith('app-fn-')) {
            const functionId = parseInt(activeId.replace('app-fn-', ''));
            // Find in deployments
            for (const deployment of modelDeployments) {
                const found = deployment.originalData?.modal_functions?.find((fn: ModalFunction) => fn.id === functionId);
                if (found) {
                    draggedEntity = found;
                    break;
                }
            }
        } else if (activeId.startsWith('function-')) {
            const functionId = parseInt(activeId.replace('function-', ''));
            // Find in gardens
            for (const garden of userGardens) {
                const found = garden.modal_functions?.find((fn: ModalFunction) => fn.id === functionId);
                if (found) {
                    draggedEntity = found;
                    break;
                }
            }
        } else if (activeId.startsWith('garden-')) {
            const gardenDoi = activeId.replace('garden-', '');
            // Find the garden by DOI in all available gardens
            const found = allGardens.find(g => g.doi === gardenDoi);
            if (found) {
                draggedEntity = found;
            }
        } else {
            // Try parsing as a direct function ID for backward compatibility
            const functionId = parseInt(activeId);
            if (!isNaN(functionId)) {
                // Search both gardens and deployments
                for (const garden of userGardens) {
                    const found = garden.modal_functions?.find((fn: ModalFunction) => fn.id === functionId);
                    if (found) {
                        draggedEntity = found;
                        break;
                    }
                }
                if (!draggedEntity) {
                    for (const deployment of modelDeployments) {
                        const found = deployment.originalData?.modal_functions?.find((fn: ModalFunction) => fn.id === functionId);
                        if (found) {
                            draggedEntity = found;
                            break;
                        }
                    }
                }
            }
        }

        // If we have selected entities and the dragged entity is among them, drag all selected
        if (selectedEntities.length > 1 && draggedEntity && selectedEntities.includes(draggedEntity)) {
            setDraggedEntities(selectedEntities);
        } else if (draggedEntity) {
            setDraggedEntities([draggedEntity]);
        } else {
            setDraggedEntities([]);
        }
    }, [userGardens, modelDeployments, allGardens]);

    const handleDragOver = useCallback((event: unknown) => {
        const dragEvent = event as { over?: { id: string } | null };
        const dropId = dragEvent.over?.id;

        if (dropId) {
            const garden = findTargetGarden(dropId);
            setDropTargetGarden(garden);
        } else {
            setDropTargetGarden(null);
        }
    }, [findTargetGarden]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { over } = event;

        try {
            if (!over || draggedEntities.length === 0) {
                return;
            }

            const dropId = over.id as string;

            // Handle dropping on saved gardens panel
            if (dropId === "saved-gardens-panel") {
                // Check if we're dragging gardens
                const gardensToSave = draggedEntities.filter(isGarden) as Garden[];
                if (gardensToSave.length > 0 && onGardenSaved) {
                    gardensToSave.forEach(garden => {
                        onGardenSaved(garden);
                    });
                    return;
                }
                // If not gardens, ignore this drop
                return;
            }

            // Handle dropping on gardens (existing functionality)
            const targetGarden = findTargetGarden(dropId);
            if (!targetGarden) {
                return;
            }

            // Only allow dropping on user's own gardens
            if (targetGarden.owner_identity_id !== userIdentityId) {
                toast.error("You can only add functions to your own gardens");
                return;
            }

            // Get all functions from dragged entities
            const functionsToAdd = getFunctionsFromEntities(draggedEntities);
            if (functionsToAdd.length === 0) {
                return;
            }

            // Filter out functions already in the target garden
            const existingFunctionIds = new Set(targetGarden.modal_functions?.map(f => f.id) || []);
            const newFunctions = functionsToAdd.filter(f => !existingFunctionIds.has(f.id));

            if (newFunctions.length === 0) {
                const entityName = draggedEntities.length === 1
                    ? getEntityDisplayName(draggedEntities[0])
                    : `${functionsToAdd.length} functions`;
                toast.info(`${entityName} already in "${targetGarden.title}"`);
                return;
            }

            // Call the success callback
            if (onFunctionsAddedToGarden) {
                onFunctionsAddedToGarden(newFunctions, targetGarden);
            }

            // Show success message
            const addedCount = newFunctions.length;
            const entityName = draggedEntities.length === 1
                ? getEntityDisplayName(draggedEntities[0])
                : `${addedCount} function${addedCount > 1 ? 's' : ''}`;
            toast.success(`Added ${entityName} to "${targetGarden.title}"`);

        } finally {
            // Always clean up
            setDraggedEntities([]);
            setDropTargetGarden(null);
        }
    }, [draggedEntities, findTargetGarden, userIdentityId, getFunctionsFromEntities, onFunctionsAddedToGarden, onGardenSaved]);

    return {
        // State
        isDragging: draggedEntities.length > 0,
        draggedEntities,
        dropTargetGarden,
        sensors,

        // Handlers
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}