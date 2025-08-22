import React, { useState } from "react";
import { Garden, ModalFunction } from "@/types";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Sprout } from "lucide-react";

type GardenTreeViewProps = {
  gardens: Garden[];
  onSelect?: (entity: Garden | ModalFunction) => void;
};

export const GardenTreeView = ({ gardens, onSelect }: GardenTreeViewProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-emerald-300 bg-emerald-100">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-semibold text-emerald-900">My Gardens</h2>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {gardens.map((g, index) => {
          return <GardenTreeNode key={index} garden={g} onSelect={onSelect} />;
        })}
      </div>
    </div>
  );
};

type GardenTreeNodeProps = {
  garden: Garden;
  onSelect?: (entity: Garden | ModalFunction) => void;
};

export const GardenTreeNode = ({ garden, onSelect }: GardenTreeNodeProps) => {
  const { setNodeRef } = useDroppable({ id: garden.doi });
  const [isExpanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(garden);
    }
  };
  return (
    <div ref={setNodeRef} className="select-none">
      <div
        className="group flex cursor-pointer items-center rounded-md p-2 transition-colors duration-150 hover:bg-gray-50"
        onClick={handleSelect}
      >
        <button
          className="mr-2 flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
        <div className="truncate font-medium text-gray-900">{garden.title}</div>
      </div>
      {isExpanded && (
        <div className="ml-7 space-y-1">
          {garden.modal_functions?.map((fn, index) => {
            return <FunctionTreeNode key={index} fn={fn} onSelect={onSelect} />;
          })}
        </div>
      )}
    </div>
  );
};

type FunctionTreeNodeProps = {
  fn: ModalFunction;
  onSelect?: (entity: Garden | ModalFunction) => void;
};

export const FunctionTreeNode = ({ fn, onSelect }: FunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fn.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(fn);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="group flex items-center rounded-md transition-colors duration-150 hover:bg-blue-50"
      style={style}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="mr-2 flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
      </div>
      {/* Clickable content */}
      <div className="flex-1 cursor-pointer p-2" onClick={handleSelect}>
        <div className="truncate text-sm text-gray-700">{fn.function_name}</div>
      </div>
    </div>
  );
};
