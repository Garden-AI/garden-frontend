import React, { useState } from "react";
import { ChevronRight, ChevronDown, Server, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { TreeNode } from "./TreeView";
import { FunctionTreeNode } from "./FunctionTreeNode";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { useSelection } from "../hooks";
import { Entity } from "../types";

interface DeploymentTreeNodeProps {
  deployment: ModelDeployment;
  selection?: ReturnType<typeof useSelection>;
  onSelect?: (entity: Entity) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export const DeploymentTreeNode: React.FC<DeploymentTreeNodeProps> = ({
  deployment,
  selection,
  onSelect,
  isExpanded = false,
  onToggleExpanded,
}) => {
  const functions = deployment.originalData?.modal_functions || [];
  const hasChildren = functions.length > 0;
  const isSelected = selection?.isSelected(deployment) || false;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'undeployed':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Server className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'border-green-200 bg-green-50';
      case 'undeployed':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(deployment);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpanded) {
      onToggleExpanded();
    }
  };

  return (
    <>
      <TreeNode
        id={`deployment-${deployment.originalData?.id}`}
        draggable={true}
        dragData={{
          type: 'deployment',
          data: deployment
        }}
        className={`
          rounded-md border p-3 cursor-pointer transition-all
          ${getStatusColor(deployment.status)}
          ${isSelected ? 'ring-2 ring-blue-400' : ''}
          hover:shadow-sm
        `}
      >
        <div onClick={handleSelect} className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {hasChildren && (
                <button
                  onClick={handleToggle}
                  className="flex-shrink-0 p-0.5 hover:bg-white/50 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-4" />}

              {getStatusIcon(deployment.status)}

              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {deployment.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {deployment.status} • {functions.length} function{functions.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TreeNode>

      {/* Render child functions when expanded */}
      {isExpanded && hasChildren && (
        <div className="ml-4 mt-1 space-y-1">
          {functions.map((func, index) => (
            <FunctionTreeNode
              key={func.function_name || index}
              func={func}
              selection={selection}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};