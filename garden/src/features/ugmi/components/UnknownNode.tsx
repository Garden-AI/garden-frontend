import React from "react";
import { NodeApi } from 'react-arborist';

interface UnknownNodeProps {
  node: NodeApi;
}

export const UnknownNode = ({ node }: UnknownNodeProps) => {
  return (
    <p>{node.data.name}</p>
  );
};