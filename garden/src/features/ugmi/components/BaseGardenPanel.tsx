import React, { useState, ReactNode } from "react";
import { TreeView } from "./TreeView";
import { GardenTreeNode } from "./GardenTreeNode";
import { PanelHeader } from "./PanelHeader";
import { GardenPanelHeaderActions } from "./GardenPanelHeaderActions";
import { Garden } from "@/types";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { useGardenFiltering, UseGardenFilteringOptions } from "../hooks/useGardenFiltering";

export interface BaseGardenPanelProps {
  // Core props
  gardens: Garden[];
  onSelect?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
  onDoubleClick?: () => void;
  selectedItem?: Entity | null;
  selection?: ReturnType<typeof useSelection>;
  isLoading?: boolean;

  // Panel-specific configuration
  panelConfig: {
    icon: ReactNode;
    title: string;
    themeColors: {
      bg: string;
      border: string;
      text: string;
      iconColor: string;
    };
  };

  // Filtering configuration
  filteringOptions: UseGardenFilteringOptions;

  // Optional custom actions - can be React node or function that takes filtering
  customActions?: ReactNode | ((filtering: ReturnType<typeof useGardenFiltering>) => ReactNode);

  // Optional custom props for specific panels
  children?: ReactNode;
  droppableProps?: {
    id: string;
    onDrop?: (draggedItems: any[]) => void;
  };

  // Custom garden node behavior
  customGardenNodeProps?: (garden: Garden) => {
    onDrop?: (draggedItems: any[]) => void;
  };
}

export const BaseGardenPanel: React.FC<BaseGardenPanelProps> = ({
  gardens,
  onSelect,
  onDoubleClick = () => {},
  selectedItem,
  selection,
  isLoading = false,
  panelConfig,
  filteringOptions,
  customActions,
  children,
  droppableProps,
  customGardenNodeProps,
}) => {
  const [expandedGardens, setExpandedGardens] = useState<Set<string>>(new Set());

  // Use the garden filtering hook
  const filtering = useGardenFiltering(gardens, filteringOptions);

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

  // Always create the header actions to get the search component
  // Custom actions can override the actions part, but we always need search
  const headerActions = GardenPanelHeaderActions({
    filtering,
    showCreateButton: false,
  });

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={panelConfig.icon}
        title={panelConfig.title}
        count={filtering.processedGardens.length}
        onDoubleClick={onDoubleClick}
        themeColors={panelConfig.themeColors}
        actions={typeof customActions === 'function' ? customActions(filtering) : customActions || headerActions?.actions}
        searchComponent={headerActions?.searchComponent}
        showSearchToggle={true}
      />

      <div className="flex-1 overflow-hidden">
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-sm text-gray-500">Loading...</div>
            </div>
          ) : filtering.processedGardens.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
              {panelConfig.icon}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  {filtering.searchTerm || filtering.hasActiveFilters ? "No matches found" : "No gardens found"}
                </p>
                <p className="text-xs text-gray-500">
                  {filtering.searchTerm || filtering.hasActiveFilters ? "Try adjusting your search or filters" : "No gardens available"}
                </p>
              </div>
            </div>
          ) : (
            <TreeView>
              {filtering.processedGardens.map((garden) => {
                const customProps = customGardenNodeProps?.(garden) || {};
                return (
                  <GardenTreeNode
                    key={garden.doi}
                    garden={garden}
                    selection={selection!}
                    onSelect={onSelect}
                    isExpanded={expandedGardens.has(garden.doi)}
                    onToggleExpanded={() => handleToggleExpansion(garden.doi)}
                    panelId={droppableProps?.id || "default"}
                    {...customProps}
                  />
                );
              })}
            </TreeView>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};