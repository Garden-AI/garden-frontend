import React from "react";
import { NodeRendererProps, NodeApi } from 'react-arborist';
import { GardenNode } from "./GardenNode";
import { FunctionNode } from "./FunctionNode";
import { DeploymentNode } from "./DeploymentNode";
import { UnknownNode } from "./UnknownNode";

export const Node = ({ node, style, dragHandle }: NodeRendererProps<NodeApi>) => {
  const handleSelect = () => {
    node.isSelected ? node.deselect() : node.select();
  }

  const handleExpand = () => {
    node.toggle();
  }

  const NodeKind = (() => {
    return node.data.id.startsWith("garden") ? GardenNode
      : node.data.id.startsWith("function") ? FunctionNode
        : node.data.id.startsWith("deployment") ? DeploymentNode
          // Shouldn't happen, but here for completeness
          : UnknownNode
  })();

  return (
    <div style={style} ref={dragHandle} className="gap-2">
      <NodeKind
        node={node}
        onSelect={handleSelect}
        onExpand={handleExpand}
      />
    </div>
  )
};