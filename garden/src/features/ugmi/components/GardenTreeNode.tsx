import React from "react";
import { ChevronDown, ChevronRight, Book, BookDashed, ArchiveX } from "lucide-react";
import { TreeNode } from "./TreeView";
import { FunctionTreeNode } from "./FunctionTreeNode";
import { Garden } from "@/types";
import { Entity } from "../types";
import { useSelection } from "../hooks";

interface GardenTreeNodeProps {
  garden: Garden;
  selection: ReturnType<typeof useSelection>;
  onSelect?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
  onDrop?: (draggedItems: any[]) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  panelId?: string;
}

const GardenDisplay: React.FC<{
  garden: Garden;
  isSelected: boolean;
  isPrimary: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (e: React.MouseEvent) => void;
}> = ({ garden, isSelected, isPrimary, isExpanded, onToggle, onSelect }) => {
  const getGardenStatus = () => {
    if (garden.is_archived) {
      return {
        icon: <ArchiveX className="h-4 w-4 text-gray-500" />,
        textColor: "text-gray-600",
        hoverBg: "hover:bg-gray-50",
        hoverBorder: "hover:border-gray-200",
      };
    } else if (garden.doi_is_draft) {
      return {
        icon: <BookDashed className="h-4 w-4 text-amber-500" />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-amber-50",
        hoverBorder: "hover:border-amber-200",
      };
    } else {
      return {
        icon: <Book className="h-4 w-4 text-emerald-600" />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-emerald-50",
        hoverBorder: "hover:border-emerald-200",
      };
    }
  };

  const status = getGardenStatus();

  const containerClasses = isPrimary
    ? "group flex cursor-pointer items-center rounded-lg border-2 border-emerald-400 bg-emerald-50 p-2 transition-all duration-150 shadow-md"
    : isSelected
      ? "group flex cursor-pointer items-center rounded-lg border-2 border-emerald-300 bg-emerald-25 p-2 transition-all duration-150 shadow-sm"
      : `group flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`;

  return (
    <div className="select-none">
      <div className={containerClasses} onClick={onSelect}>
        <button
          className="mr-2 flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
        <div className="flex items-center gap-2">
          {status.icon}
          <div className={`truncate text-sm font-medium ${status.textColor}`}>
            {garden.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GardenTreeNode: React.FC<GardenTreeNodeProps> = ({
  garden,
  selection,
  onSelect,
  onDrop,
  isExpanded = false,
  onToggleExpanded,
  panelId = "default"
}) => {
  const isSelected = selection.isSelected(garden);
  const isPrimary = selection.isPrimarySelection(garden);

  const handleSelect = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(garden, {
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
      });
    }
  };

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded();
    }
  };

  return (
    <TreeNode
      id={`${panelId}-garden-${garden.doi}`}
      draggable={true}
      dragData={{ type: 'garden', data: garden }}
      onDrop={onDrop}
    >
      <div>
        <GardenDisplay
          garden={garden}
          isSelected={isSelected}
          isPrimary={isPrimary}
          isExpanded={isExpanded}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />

        {isExpanded && (
          <>
            {/* Modal Functions */}
            {garden.modal_functions && garden.modal_functions.length > 0 && (
              <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
                {garden.modal_functions.map(fn => (
                  <FunctionTreeNode
                    key={`modal-${fn.id}`}
                    fn={{ ...fn, functionType: 'modal' }}
                    selection={selection}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}

            {/* HPC Functions */}
            {garden.hpc_functions && garden.hpc_functions.length > 0 && (
              <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
                {garden.hpc_functions.map(fn => (
                  <FunctionTreeNode
                    key={`hpc-${fn.id}`}
                    fn={{ ...fn, functionType: 'hpc' }}
                    selection={selection}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </TreeNode>
  );
};