import React from "react";
import { ChevronRight, ChevronDown, CircleCheck, CircleX, Loader2 } from "lucide-react";
import { TreeNode } from "./TreeView";
import { FunctionTreeNode } from "./FunctionTreeNode";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { useSelection } from "../hooks";
import { Entity } from "../types";
import { ModalFunction } from "@/types";

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
        return <CircleCheck className="h-4 w-4 text-green-600" />;
      case 'undeployed':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <CircleX className="h-4 w-4 text-red-600" />;
      default:
        return <CircleCheck className="h-4 w-4 text-gray-600" />;
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
          rounded-md p-2 cursor-pointer transition-all hover:bg-gray-100
          ${isSelected ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50'}
        `}
      >
        <div onClick={handleSelect} className="w-full">
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={handleToggle}
                className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-gray-600" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-600" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}

            {getStatusIcon(deployment.status)}

            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {deployment.name}
              </div>
            </div>
          </div>
        </div>
      </TreeNode>

      {/* Render child functions when expanded */}
      {isExpanded && hasChildren && (
        <div className="ml-6 mt-1 space-y-1">
          {functions.map((func: ModalFunction, index: number) => (
            <FunctionTreeNode
              key={func.function_name || index}
              fn={func}
              selection={selection!}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};