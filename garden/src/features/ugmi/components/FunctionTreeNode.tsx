import React from "react";
import { TreeNode } from "./TreeView";
import { ModalFunction, HpcFunction } from "@/types";
import { GardenFunction } from "../../functions/shared/types/function.types";
import { Entity } from "../types";
import { useSelection } from "../hooks";
import { Cpu } from "lucide-react";

interface FunctionTreeNodeProps {
  fn: GardenFunction;
  selection: ReturnType<typeof useSelection>;
  onSelect?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
}

const FunctionDisplay: React.FC<{
  fn: GardenFunction;
  isSelected: boolean;
  isPrimary: boolean;
  onSelect: (e: React.MouseEvent) => void;
}> = ({ fn, isSelected, isPrimary, onSelect }) => {
  // Determine styling based on function type
  const isHpc = fn.functionType === 'hpc';

  // Build container classes based on state and function type
  let containerClasses: string;
  if (isPrimary) {
    containerClasses = isHpc
      ? "group flex items-center rounded-md border-2 border-purple-400 bg-purple-50 transition-all duration-150 shadow-md"
      : "group flex items-center rounded-md border-2 border-blue-400 bg-blue-50 transition-all duration-150 shadow-md";
  } else if (isSelected) {
    containerClasses = isHpc
      ? "group flex items-center rounded-md border-2 border-purple-300 bg-purple-25 transition-all duration-150 shadow-sm"
      : "group flex items-center rounded-md border-2 border-blue-300 bg-blue-25 transition-all duration-150 shadow-sm";
  } else {
    containerClasses = isHpc
      ? "group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
      : "group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm";
  }

  // Get display name - use title for all functions (search results don't include function_name)
  // Full metadata will have function_name, but search results only have title
  const displayName = isHpc
    ? (fn as HpcFunction).title || (fn as HpcFunction).function_name
    : (fn as ModalFunction).title;

  return (
    <div
      className={`${containerClasses} cursor-grab active:cursor-grabbing`}
      onClick={onSelect}
      title="Click to select, drag to add to garden"
    >
      <div className="flex items-center gap-1.5 flex-1 px-2 py-1.5">
        {isHpc && <Cpu className="h-3 w-3 text-purple-600 flex-shrink-0" />}
        <div className="truncate text-xs font-medium text-gray-700">
          {displayName}
        </div>
      </div>
    </div>
  );
};

export const FunctionTreeNode: React.FC<FunctionTreeNodeProps> = ({
  fn,
  selection,
  onSelect
}) => {
  const isSelected = selection.isSelected(fn);
  const isPrimary = selection.isPrimarySelection(fn);

  const handleSelect = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(fn, {
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
      });
    }
  };

  // Use entity ID format to avoid collisions between modal and HPC functions
  const nodeId = fn.functionType === 'hpc'
    ? `hpc-function-${fn.id}`
    : `modal-function-${fn.id}`;

  return (
    <TreeNode
      id={nodeId}
      draggable={true}
      dragData={{ type: 'function', data: fn }}
    >
      <FunctionDisplay
        fn={fn}
        isSelected={isSelected}
        isPrimary={isPrimary}
        onSelect={handleSelect}
      />
    </TreeNode>
  );
};