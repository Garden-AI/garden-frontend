import React, { useMemo } from "react";
import { Library } from "lucide-react";
import { ModalAppForm } from "../../modal/components/ModalAppForm";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import {
  BaseTreeView,
  TreeNode,
  SortOption,
  FilterConfig,
  ThemeColors,
  SearchFunction,
  FilterFunction,
} from "./BaseTreeView";
import { DeploymentParentNode, DeploymentFunctionNode } from "./DeploymentTreeNodes";

type Entity = Garden | ModalFunction | ModelDeployment;

type FunctionLibraryViewProps = {
  modelDeployments: ModelDeployment[];
  gardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
  selectedItem?: Entity | null;
  isLoading?: boolean;
};

export const MyFunctionLibraryView = ({
  modelDeployments,
  gardens,
  onSelect,
  onDoubleClick,
  onDeploymentCreated,
  selectedItem,
  isLoading = false,
}: FunctionLibraryViewProps) => {
  // Transform deployments into tree node structure - no filtering needed since
  // we only get the user's deployments anyway
  const treeData: TreeNode<ModelDeployment, ModalFunction>[] = useMemo(() => {
    const nodes: TreeNode<ModelDeployment, ModalFunction>[] = [];

    modelDeployments.forEach((deployment) => {
      // Get all functions from this deployment
      const deploymentFunctions = deployment.originalData?.modal_functions || [];

      // Include all deployments (they're already filtered to user's deployments)
      if (deploymentFunctions.length > 0) {
        nodes.push({
          parent: deployment,
          children: deploymentFunctions,
        });
      }
    });

    return nodes;
  }, [modelDeployments]);

  // Define sorting options
  const sortOptions: SortOption<ModelDeployment>[] = [
    {
      label: "Name (A-Z)",
      value: "name",
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      label: "Name (Z-A)",
      value: "name-desc",
      sortFn: (a, b) => b.name.localeCompare(a.name),
    },
    {
      label: "Status (Deployed First)",
      value: "status-deployed",
      sortFn: (a, b) => {
        const statusOrder = { deployed: 0, undeployed: 1, error: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      },
    },
  ];

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    { label: "Deployed", key: "deployed", defaultChecked: true },
    { label: "In-Progress", key: "undeployed", defaultChecked: true },
    { label: "Error", key: "error", defaultChecked: true },
  ];

  // Define search function
  const searchFunction: SearchFunction<ModelDeployment, ModalFunction> = (node, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      node.parent.name.toLowerCase().includes(searchLower) ||
      node.children.some(
        (func) =>
          func.function_name?.toLowerCase().includes(searchLower) ||
          func.title?.toLowerCase().includes(searchLower) ||
          (func.description?.toLowerCase().includes(searchLower) ?? false),
      )
    );
  };

  // Define filter function
  const filterFunction: FilterFunction<ModelDeployment, ModalFunction> = (node, filterState) => {
    const deployment = node.parent;
    if (deployment.status === "deployed" && !filterState.deployed) return false;
    if (deployment.status === "undeployed" && !filterState.undeployed) return false;
    if (deployment.status === "error" && !filterState.error) return false;
    return true;
  };

  const themeColors: ThemeColors = {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-900",
    iconColor: "text-blue-700",
    hoverColor: "hover:bg-blue-200",
    activeColor: "bg-blue-200",
  };

  return (
    <div className="h-full bg-blue-50 rounded-lg">
      <BaseTreeView
        data={treeData}
        isLoading={isLoading}
        ParentNodeComponent={DeploymentParentNode}
        ChildNodeComponent={DeploymentFunctionNode}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
        selectedItem={selectedItem}
        showHeader={true}
        headerIcon={<Library className="h-4 w-4" />}
        headerTitle="My Function Library"
        headerThemeColors={themeColors}
        searchPlaceholder="Search my functions..."
        searchFunction={searchFunction}
        sortOptions={sortOptions}
        filterConfigs={filterConfigs}
        filterFunction={filterFunction}
        emptyIcon={<Library className="h-8 w-8" />}
        emptyTitle="No Functions Found"
        emptyDescription="Deploy a new function to get started"
        CreateFormComponent={(props) => (
          <CreateFunctionFormWrapper 
            {...props} 
            onDeploymentCreated={onDeploymentCreated}
          />
        )}
        createDialogTitle="Create New Function"
      />
    </div>
  );
};

// Wrapper component to match the expected onSuccess signature
const CreateFunctionFormWrapper: React.FC<{
  onSuccess: (fn: any) => void;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
}> = ({ onSuccess, onDeploymentCreated }) => (
  <ModalAppForm
    onDeploymentSuccess={(deployment: ModelDeployment) => {
      // Call onDeploymentCreated immediately with the full deployment object
      // No need to refetch user functions - we get functions directly from deployments
      onDeploymentCreated?.(deployment);
    }}
    onSuccess={(id: number) => {
      // This is called when the form wants to close (after deployment starts)
      onSuccess(id);
    }}
  />
);

