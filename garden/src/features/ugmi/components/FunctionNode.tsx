import React from "react";
import { NodeApi } from 'react-arborist';

const selectedStyle = "border-red-400 border-2";

interface FunctionNodeProps {
  node: NodeApi;
}

export const FunctionNode = ({ node }: FunctionNodeProps) => {
  node.isDraggable = true;
  node.isDropTarget = false;

  return (
    <div className="flex">
      <p className={`${node.isSelected ? `font-bold ${selectedStyle}` : ""}`}>- {node.data.name}</p>
    </div>
  );
};