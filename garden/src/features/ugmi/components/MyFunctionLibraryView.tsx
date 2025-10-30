import React, { useState, useMemo, useEffect } from "react";
import { Library, ChevronDown, ChevronRight, Cloud, Cpu } from "lucide-react";
import { Garden, HpcFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { useGetModelDeployments } from "../../model-deployments/api/useGetModelDeployments";
import { useDeploymentSync } from "../../model-deployments/api/useDeploymentSync";
import { useHpcFunctions } from "../../functions/hpc/api/useHpcFunctions";
import { TreeView } from "./TreeView";
import { DeploymentTreeNode } from "./DeploymentTreeNode";
import { FunctionTreeNode } from "./FunctionTreeNode";
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
  const [modalSectionExpanded, setModalSectionExpanded] = useState(true);
  const [hpcSectionExpanded, setHpcSectionExpanded] = useState(true);

  // Fetch model deployments
  const {
    data: modelDeployments,
    isLoading: modelDeploymentsLoading,
    refetch: refetchModelDeployments
  } = useGetModelDeployments();

  // Fetch HPC functions
  const {
    data: hpcFunctions,
    isLoading: hpcFunctionsLoading,
    refetch: refetchHpcFunctions
  } = useHpcFunctions();

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
  
  // Use the deployment filtering hook for modal deployments
  const filtering = useDeploymentFiltering(modelDeployments || [], functionLibraryFilteringOptions);

  // Filter HPC functions based on search term only
  const filteredHpcFunctions = useMemo(() => {
    if (!hpcFunctions) return [];

    // If no search term, return all (functionType already added by useHpcFunctions hook)
    if (!filtering.searchTerm) {
      return hpcFunctions;
    }

    // Filter by search term
    const searchLower = filtering.searchTerm.toLowerCase();
    return hpcFunctions.filter(fn =>
      fn.title?.toLowerCase().includes(searchLower) ||
      fn.function_name?.toLowerCase().includes(searchLower) ||
      fn.description?.toLowerCase().includes(searchLower)
    );
  }, [hpcFunctions, filtering.searchTerm]);

  // Combined loading state
  const isLoading = modelDeploymentsLoading || hpcFunctionsLoading;

  // Total count of all functions
  const totalCount = filtering.processedDeployments.length + filteredHpcFunctions.length;

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
    // Refetch both modal deployments and HPC functions
    refetchModelDeployments();
    refetchHpcFunctions();
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
        count={totalCount}
        onDoubleClick={onDoubleClick}
        themeColors={themeColors}
        actions={headerActions?.actions}
        searchComponent={headerActions?.searchComponent}
        showSearchToggle={true}
      />

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : totalCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
            <Library className="h-12 w-12 text-gray-300" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {(modelDeployments?.length || 0) === 0 && (hpcFunctions?.length || 0) === 0 ? "No Functions Found" : "No matches found"}
              </p>
              <p className="text-xs text-gray-500">
                {(modelDeployments?.length || 0) === 0 && (hpcFunctions?.length || 0) === 0 ? "Deploy a new function to get started" : "Try adjusting your search or filters"}
              </p>
            </div>
          </div>
        ) : (
          <TreeView>
            {/* Modal Functions Section */}
            {filtering.processedDeployments.length > 0 && (
              <>
                <div
                  className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors"
                  onClick={() => setModalSectionExpanded(!modalSectionExpanded)}
                >
                  {modalSectionExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Modal Functions
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({filtering.processedDeployments.length})
                  </span>
                </div>

                {modalSectionExpanded && (
                  <div className="ml-4 space-y-1 mt-1">
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
                  </div>
                )}
              </>
            )}

            {/* HPC Functions Section */}
            {filteredHpcFunctions.length > 0 && (
              <>
                <div
                  className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors mt-2"
                  onClick={() => setHpcSectionExpanded(!hpcSectionExpanded)}
                >
                  {hpcSectionExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                  <Cpu className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    HPC Functions
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({filteredHpcFunctions.length})
                  </span>
                </div>

                {hpcSectionExpanded && (
                  <div className="ml-4 space-y-1 mt-1">
                    {filteredHpcFunctions.map(fn => (
                      <FunctionTreeNode
                        key={fn.id}
                        fn={fn}
                        selection={selection!}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TreeView>
        )}
      </div>
    </div>
  );
};

