import React, { useState, useMemo, useEffect } from "react";
import { Library } from "lucide-react";
import { Garden } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { useGetModelDeployments } from "../../model-deployments/api/useGetModelDeployments";
import { useDeploymentSync } from "../../model-deployments/api/useDeploymentSync";
import { TreeView } from "./TreeView";
import { DeploymentTreeNode } from "./DeploymentTreeNode";
import { PanelHeader } from "./PanelHeader";
import { BasePanelHeaderActions } from "./BasePanelHeaderActions";
import { CreateFunctionFormWrapper } from "./CreateFunctionFormWrapper";
import { useSelection } from "../hooks";
import { Entity, isDeployment } from "../types";
import { useDeploymentFiltering } from "../hooks/useDeploymentFiltering";
import { functionLibraryFilteringOptions } from "../hooks/deploymentFilteringConfigs";

export type FunctionLibraryViewProps = {
  gardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
  selectedItem?: Entity | null;
  selection?: ReturnType<typeof useSelection>;
};

export const MyFunctionLibraryView = ({
  gardens,
  onSelect,
  onDoubleClick,
  onDeploymentCreated,
  selectedItem,
  selection,
}: FunctionLibraryViewProps) => {
  const [expandedDeployments, setExpandedDeployments] = useState<Set<number>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch model deployments
  const {
    data: modelDeployments,
    isLoading: modelDeploymentsLoading,
    refetch: refetchModelDeployments
  } = useGetModelDeployments();

  // Polling logic for pending deployments
  const shouldPollDeployments = useMemo(() => {
    return modelDeployments?.some(
      deployment => deployment.originalData?.deploy_status === "pending"
    ) ?? false;
  }, [modelDeployments]);

  useEffect(() => {
    if (!shouldPollDeployments) return;

    const intervalId = setInterval(() => {
      refetchModelDeployments();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [shouldPollDeployments, refetchModelDeployments]);

  // Keep selected deployment in sync with fresh data from cache
  useDeploymentSync(
    selectedItem && isDeployment(selectedItem) ? selectedItem : null,
    modelDeployments || [],
    (updatedDeployment: ModelDeployment) => {
      if (onSelect) {
        onSelect(updatedDeployment);
      }
    }
  );
  
  // Use the deployment filtering hook
  const filtering = useDeploymentFiltering(modelDeployments || [], functionLibraryFilteringOptions);

  const handleToggleExpansion = (deploymentId: number) => {
    setExpandedDeployments(prev => {
      const next = new Set(prev);
      if (next.has(deploymentId)) {
        next.delete(deploymentId);
      } else {
        next.add(deploymentId);
      }
      return next;
    });
  };


  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  const themeColors = {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-900",
    iconColor: "text-blue-700",
  };

  const CreateFunctionComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => (
    <CreateFunctionFormWrapper 
      onSuccess={onSuccess} 
      onDeploymentCreated={onDeploymentCreated} 
    />
  );

  const headerActions = BasePanelHeaderActions({
    filtering,
    searchPlaceholder: "Search my functions...",
    showCreateButton: true,
    CreateComponent: CreateFunctionComponent,
    createDialogTitle: "Create New Function",
    onCreateSuccess: () => {},
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  });

  return (
    <div className="h-full bg-blue-50 rounded-lg">
      <PanelHeader
        icon={<Library className="h-5 w-5" />}
        title="My Function Library"
        count={filtering.processedDeployments.length}
        onDoubleClick={onDoubleClick}
        themeColors={themeColors}
        actions={headerActions?.actions}
        searchComponent={headerActions?.searchComponent}
        showSearchToggle={true}
      />

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {modelDeploymentsLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : filtering.processedDeployments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
            <Library className="h-12 w-12 text-gray-300" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {(modelDeployments?.length || 0) === 0 ? "No Functions Found" : "No matches found"}
              </p>
              <p className="text-xs text-gray-500">
                {(modelDeployments?.length || 0) === 0 ? "Deploy a new function to get started" : "Try adjusting your search or filters"}
              </p>
            </div>
          </div>
        ) : (
          <TreeView>
            {filtering.processedDeployments.map(deployment => (
              <DeploymentTreeNode
                key={deployment.originalData?.id}
                deployment={deployment}
                selection={selection}
                onSelect={onSelect}
                isExpanded={expandedDeployments.has(deployment.originalData?.id || 0)}
                onToggleExpanded={() => handleToggleExpansion(deployment.originalData?.id || 0)}
              />
            ))}
          </TreeView>
        )}
      </div>
    </div>
  );
};

