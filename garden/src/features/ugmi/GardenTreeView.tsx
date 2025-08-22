import React, { useState } from "react";
import { Garden, ModalFunction } from "@/types";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight } from "lucide-react";

type GardenTreeViewProps = {
  gardens: Garden[];
  onSelect?: (entity: Garden | ModalFunction) => void;
};

export const GardenTreeView = ({ gardens, onSelect }: GardenTreeViewProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">My Gardens</h2>
      </div>
      <div className="flex-1 p-2 space-y-1 overflow-y-auto">
        {gardens.map((g, index) => {
          return <GardenTreeNode key={index} garden={g} onSelect={onSelect} />
        })}
      </div>
    </div>
  );
};

type GardenTreeNodeProps = {
  garden: Garden,
  onSelect?: (entity: Garden | ModalFunction) => void,
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
  }
  return (
    <div ref={setNodeRef} className="select-none">
      <div 
        className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer group transition-colors duration-150"
        onClick={handleSelect}
      >
        <button
          className="flex items-center justify-center w-5 h-5 mr-2 hover:bg-gray-200 rounded transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
        <div className="font-medium text-gray-900 truncate">{garden.title}</div>
      </div>
      {isExpanded && (
        <div className="ml-7 space-y-1">
          {garden.modal_functions?.map((fn, index) => {
            return <FunctionTreeNode key={index} fn={fn} onSelect={onSelect} />
          })}
        </div>
      )}
    </div>
  );
}

type FunctionTreeNodeProps = {
  fn: ModalFunction,
  onSelect?: (entity: Garden | ModalFunction) => void,
}

export const FunctionTreeNode = ({ fn, onSelect }: FunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fn.id })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(fn);
    }
  }
  
  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes} 
      className="flex items-center p-2 rounded-md hover:bg-blue-50 cursor-grab active:cursor-grabbing transition-colors duration-150 group"
      style={style}
      onClick={handleSelect}
    >
      <div className="w-4 h-4 mr-2 flex items-center justify-center">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
      </div>
      <div className="text-sm text-gray-700 truncate">{fn.function_name}</div>
    </div>
  );
}