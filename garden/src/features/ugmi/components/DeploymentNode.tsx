import React from "react";
import { NodeApi } from 'react-arborist';

interface DeploymentNodeProps {
  node: NodeApi;
}

export const DeploymentNode = ({ node }: DeploymentNodeProps) => {
  return (
    <p>{node.data.name}</p>
  );
};