import { useState, useCallback } from "react";

export function useTreeExpansion() {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const handleToggleExpanded = useCallback((itemId: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    const isExpanded = useCallback((itemId: string) => {
        return expandedItems.has(itemId);
    }, [expandedItems]);

    const expandAll = useCallback((itemIds: string[]) => {
        setExpandedItems(new Set(itemIds));
    }, []);

    const collapseAll = useCallback(() => {
        setExpandedItems(new Set());
    }, []);

    return {
        expandedItems,
        handleToggleExpanded,
        isExpanded,
        expandAll,
        collapseAll,
    };
}
