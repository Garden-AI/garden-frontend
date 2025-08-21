import React, { useState } from "react";
import { Garden, ModalFunction } from "@/types";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight } from "lucide-react";

type GardenTreeViewProps = {
  gardens: Garden[];
  onSelect?: (garden: Garden) => void;
};

export const GardenTreeView = ({ gardens, onSelect }: GardenTreeViewProps) => {
  return (
    <div >
      {gardens.map((g, index) => {
        return <GardenTreeNode key={index} garden={g} onSelect={onSelect} />
      })}
    </div>
  );
};

type GardenTreeNodeProps = {
  garden: Garden,
  onSelect?: (garden: Garden) => void,
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
    <div ref={setNodeRef} onClick={handleSelect}>
      <div className="flex item-center">
        <div onClick={handleToggleExpand}>
          {isExpanded ? (<ChevronDown />) : (<ChevronRight />)}
        </div>
        <div>{garden.title}</div>
      </div>
      <div className="flex flex-col">
        {isExpanded && (
          garden.modal_functions?.map((fn, index) => {
            return <FunctionTreeNode key={index} fn={fn} />
          })
        )}
      </div>
    </div >
  );
}

type FunctionTreeNodeProps = {
  fn: ModalFunction,
}

export const FunctionTreeNode = ({ fn }: FunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fn.id })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="ml-10">
      <div>{fn.function_name}</div>
    </div>
  );
}