import React, { useState } from "react";
import { Globe } from "lucide-react";
import { TreeView } from "./TreeView";
import { GardenTreeNode } from "./GardenTreeNode";
import { PanelHeader } from "./PanelHeader";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { useGetGardens } from "../../gardens/api/useGetGardens";
import { Garden } from "@/types";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { useGardenFiltering } from "../hooks/useGardenFiltering";
import { publishedGardensFilteringOptions } from "../hooks/gardenFilteringConfigs";

export type PublishedGardensPanelProps = {
    onSelect?: (entity: Entity) => void;
    onDoubleClick?: () => void;
    selectedItem?: Entity | null;
    selection?: ReturnType<typeof useSelection>;
};

export const PublishedGardensPanel = ({ onSelect, onDoubleClick, selectedItem, selection }: PublishedGardensPanelProps) => {
    const [expandedGardens, setExpandedGardens] = useState<Set<string>>(new Set());

    // Fetch published gardens (non-draft) - lowest priority
    const { data: publishedGardens = [], isLoading: publishedGardensLoading } = useGetGardens({
        draft: false,
        limit: 100
    });

    // Use the garden filtering hook
    const filtering = useGardenFiltering(publishedGardens, publishedGardensFilteringOptions);

    const handleToggleExpansion = (gardenDoi: string) => {
        setExpandedGardens(prev => {
            const next = new Set(prev);
            if (next.has(gardenDoi)) {
                next.delete(gardenDoi);
            } else {
                next.add(gardenDoi);
            }
            return next;
        });
    };

    const themeColors = {
        bg: "bg-purple-100",
        border: "border-purple-300",
        text: "text-purple-900",
        iconColor: "text-purple-700",
    };

    const headerActions = GardenPanelHeaderActions({
        filtering,
        searchPlaceholder: "Search published gardens...",
        showCreateButton: false, // No create button for published gardens
    });

    return (
        <div className="h-full flex-1 bg-purple-50 rounded-lg">
            <PanelHeader
                icon={<Globe className="h-5 w-5" />}
                title="Published Gardens"
                count={filtering.processedGardens.length}
                onDoubleClick={onDoubleClick}
                themeColors={themeColors}
                actions={headerActions.actions}
                searchComponent={headerActions.searchComponent}
                showSearchToggle={true}
            />

            {/* Content */}
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {publishedGardensLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-sm text-gray-500">Loading...</div>
                    </div>
                ) : filtering.processedGardens.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
                        <Globe className="h-12 w-12 text-gray-300" />
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">
                                {publishedGardens.length === 0 ? "No Published Gardens" : "No matches found"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {publishedGardens.length === 0 ? "Check back later for published gardens" : "Try adjusting your search"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <TreeView>
                        {filtering.processedGardens.map(garden => (
                            <GardenTreeNode
                                key={garden.doi}
                                garden={garden}
                                selection={selection}
                                onSelect={onSelect}
                                isExpanded={expandedGardens.has(garden.doi)}
                                onToggleExpanded={() => handleToggleExpansion(garden.doi)}
                                panelId="published-gardens"
                            />
                        ))}
                    </TreeView>
                )}
            </div>
        </div>
    );
};

