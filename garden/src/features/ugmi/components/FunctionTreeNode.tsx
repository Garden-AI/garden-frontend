import React from "react";
import { TreeNode } from "./TreeView";
import { ModalFunction } from "@/types";
import { Entity } from "../types";
import { useSelection } from "../hooks";

interface FunctionTreeNodeProps {
  fn: ModalFunction;
  selection: ReturnType<typeof useSelection>;
  onSelect?: (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => void;
}

const FunctionDisplay: React.FC<{
  fn: ModalFunction;
  isSelected: boolean;
  isPrimary: boolean;
  onSelect: (e: React.MouseEvent) => void;
}> = ({ fn, isSelected, isPrimary, onSelect }) => {
  const containerClasses = isPrimary
    ? "group flex items-center rounded-md border-2 border-blue-400 bg-blue-50 transition-all duration-150 shadow-md"
    : isSelected
      ? "group flex items-center rounded-md border-2 border-blue-300 bg-blue-25 transition-all duration-150 shadow-sm"
      : "group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm";

  return (
    <div
      className={`${containerClasses} cursor-grab active:cursor-grabbing`}
      onClick={onSelect}
      title="Click to select, drag to add to garden"
    >
      <div className="flex-1 px-2 py-1.5">
        <div className="truncate text-xs font-medium text-gray-700">
          {fn.function_name}
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

  return (
    <TreeNode
      id={fn.id.toString()}
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