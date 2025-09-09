import { useState, useCallback } from "react";
import { Entity, getEntityId, ClickEvent } from "../types";

export function useSelection() {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [primarySelection, setPrimarySelection] = useState<Entity | null>(null);

    const selectSingle = useCallback((entity: Entity) => {
        const entityId = getEntityId(entity);
        setSelectedItems(new Set([entityId]));
        setPrimarySelection(entity);
    }, []);

    const toggleSelection = useCallback((entity: Entity) => {
        const entityId = getEntityId(entity);
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(entityId)) {
                newSet.delete(entityId);
                // If removing the primary selection, clear it
                if (primarySelection && getEntityId(primarySelection) === entityId) {
                    setPrimarySelection(null);
                }
            } else {
                newSet.add(entityId);
                setPrimarySelection(entity);
            }
            return newSet;
        });
    }, [primarySelection]);

    const clearSelection = useCallback(() => {
        setSelectedItems(new Set());
        setPrimarySelection(null);
    }, []);

    const isSelected = useCallback((entity: Entity): boolean => {
        return selectedItems.has(getEntityId(entity));
    }, [selectedItems]);

    const isPrimarySelection = useCallback((entity: Entity): boolean => {
        return primarySelection ? getEntityId(primarySelection) === getEntityId(entity) : false;
    }, [primarySelection]);

    const getSelectedEntities = useCallback((allEntities: Entity[]): Entity[] => {
        return allEntities.filter(entity => selectedItems.has(getEntityId(entity)));
    }, [selectedItems]);

    const handleClick = useCallback((
        entity: Entity,
        event: ClickEvent
    ) => {
        const isCtrlOrCmd = event.ctrlKey || event.metaKey;

        if (isCtrlOrCmd) {
            toggleSelection(entity);
        } else {
            selectSingle(entity);
        }
        // Note: Shift+click range selection can be added later if needed
    }, [selectSingle, toggleSelection]);

    return {
        // State
        selectedItems,
        primarySelection,
        hasSelection: selectedItems.size > 0,
        hasMultipleSelected: selectedItems.size > 1,

        // Actions
        selectSingle,
        toggleSelection,
        clearSelection,
        handleClick,

        // Helpers
        isSelected,
        isPrimarySelection,
        getSelectedEntities,
    };
}