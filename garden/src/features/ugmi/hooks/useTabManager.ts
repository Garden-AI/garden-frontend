import { useState, useCallback } from "react";
import { Entity, getEntityId } from "../types";

export interface TabItem {
    entity: Entity;
    id: string;
}

export function useTabManager() {
    const [openTabs, setOpenTabs] = useState<TabItem[]>([]);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    const openTab = useCallback((entity: Entity) => {
        const entityId = getEntityId(entity);
        
        setOpenTabs(prev => {
            const existingTab = prev.find(tab => tab.id === entityId);
            if (existingTab) {
                setActiveTabId(entityId);
                return prev;
            }
            
            const newTab: TabItem = { entity, id: entityId };
            setActiveTabId(entityId);
            return [...prev, newTab];
        });
    }, []);

    const closeTab = useCallback((entityId: string) => {
        setOpenTabs(prev => {
            const newTabs = prev.filter(tab => tab.id !== entityId);
            
            if (activeTabId === entityId) {
                if (newTabs.length > 0) {
                    const closedIndex = prev.findIndex(tab => tab.id === entityId);
                    const newActiveIndex = closedIndex > 0 ? closedIndex - 1 : 0;
                    setActiveTabId(newTabs[newActiveIndex]?.id || null);
                } else {
                    setActiveTabId(null);
                }
            }
            
            return newTabs;
        });
    }, [activeTabId]);

    const setActiveTab = useCallback((entityId: string) => {
        setActiveTabId(entityId);
    }, []);

    const getActiveEntity = useCallback((): Entity | null => {
        if (!activeTabId) return null;
        const activeTab = openTabs.find(tab => tab.id === activeTabId);
        return activeTab?.entity || null;
    }, [activeTabId, openTabs]);

    const closeAllTabs = useCallback(() => {
        setOpenTabs([]);
        setActiveTabId(null);
    }, []);

    const isTabOpen = useCallback((entity: Entity): boolean => {
        const entityId = getEntityId(entity);
        return openTabs.some(tab => tab.id === entityId);
    }, [openTabs]);

    const reorderTabs = useCallback((newOrder: TabItem[]) => {
        setOpenTabs(newOrder);
    }, []);

    return {
        // State
        openTabs,
        activeTabId,
        hasOpenTabs: openTabs.length > 0,
        
        // Actions
        openTab,
        closeTab,
        setActiveTab,
        closeAllTabs,
        reorderTabs,
        
        // Helpers
        getActiveEntity,
        isTabOpen,
    };
}