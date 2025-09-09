import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { NodeApi } from 'react-arborist';

const selectedStyle = "border-red-400 border-2";

interface GardenNodeProps {
  node: NodeApi;
  onSelect: () => void;
  onExpand: () => void;
}

export const GardenNode = ({ node, onSelect, onExpand }: GardenNodeProps) => {
  const Chevron = node.isOpen ? ChevronDown : ChevronRight;
  node.isDropTarget = true;

  return (
    <div
      className={`flex items-center justify-start truncate rounded-md ${node.isSelected ? selectedStyle : ""} ${node.willReceiveDrop ? 'bg-blue-100 border-blue-300 border-2' : ''}`}
      onClick={onSelect}
    >
      <Chevron className="rounded-sm hover:bg-brightgreen" size={16} onClick={onExpand} />
      <p className={`ml-2 ${node.isSelected ? "font-bold" : ""}`}>{node.data.name}</p>
    </div>
  );
};