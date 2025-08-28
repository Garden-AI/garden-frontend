import React, { useState } from "react";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { ModalFunction } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Boxes, Plus } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { ModalAppForm } from "../modal/components/ModalAppForm";
import {
  BaseTreeView,
  TreeNode,
  SortOption,
  FilterConfig,
  ThemeColors,
  SearchFunction,
  FilterFunction,
} from "./components/BaseTreeView";
import { DeploymentParentNode, DeploymentFunctionNode } from "./components/DeploymentTreeNodes";

// Union type for selected items
type SelectedItem = ModelDeployment | ModalFunction | null;

export type DeploymentTreeViewProps = {
  apps: ModelDeployment[];
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: SelectedItem;
  isCompact?: boolean;
};

export const DeploymentTreeView = ({
  apps,
  onSelect,
  selectedItem,
  isCompact = false,
}: DeploymentTreeViewProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const auth = useGlobusAuth();

  const handleCreateClick = async () => {
    if (!auth.isAuthenticated) {
      await auth.authorization?.login();
      return;
    }
    setShowCreateDialog(true);
  };

  // Transform deployments into tree node structure
  const treeData: TreeNode<ModelDeployment, ModalFunction>[] = apps.map((app) => ({
    parent: app,
    children: app.originalData?.modal_functions || [],
  }));

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
    {
      label: "Status (Error First)",
      value: "status-error",
      sortFn: (a, b) => {
        const statusOrder = { error: 0, undeployed: 1, deployed: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      },
    },
  ];

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    { label: "Deployed", key: "deployed", defaultChecked: true },
    { label: "Undeployed", key: "undeployed", defaultChecked: true },
    { label: "Error", key: "error", defaultChecked: true },
  ];

  // Define search function
  const searchFunction: SearchFunction<ModelDeployment, ModalFunction> = (node, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return node.parent.name.toLowerCase().includes(searchLower);
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

  // Compact layout for when embedded in the deployment section
  if (isCompact) {
    return (
      <div className="flex h-full flex-col">
        {/* Compact header with just create button */}
        <div className="border-b border-gray-200 bg-gray-100 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Boxes className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Deployments</span>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 transition-colors hover:bg-gray-200 hover:shadow-sm"
                    onClick={handleCreateClick}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create Deployment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {treeData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2 py-4 text-center">
              <Boxes className="h-8 w-8 text-gray-300" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">No Deployments</p>
                <p className="text-xs text-gray-500">Create one to get started</p>
              </div>
            </div>
          ) : (
            <BaseTreeView
              data={treeData}
              ParentNodeComponent={(props) => <DeploymentParentNode {...props} isCompact={true} />}
              ChildNodeComponent={(props) => <DeploymentFunctionNode {...props} isCompact={true} />}
              onSelect={onSelect}
              selectedItem={selectedItem}
              showHeader={false}
              searchPlaceholder="Search deployments by name..."
              searchFunction={searchFunction}
              sortOptions={sortOptions}
              filterConfigs={filterConfigs}
              filterFunction={filterFunction}
              emptyIcon={<Boxes className="h-8 w-8" />}
              emptyTitle="No Deployments"
              emptyDescription="Create one to get started"
              isCompact={true}
            />
          )}
        </div>

        {/* Create App Deployment Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
            <DialogHeader>
              <DialogTitle>Create New Model Deployment</DialogTitle>
            </DialogHeader>
            <ModalAppForm onSuccess={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Full layout for standalone deployment management
  return (
    <BaseTreeView
      data={treeData}
      ParentNodeComponent={DeploymentParentNode}
      ChildNodeComponent={DeploymentFunctionNode}
      onSelect={onSelect}
      selectedItem={selectedItem}
      showHeader={true}
      headerIcon={<Boxes className="h-5 w-5" />}
      headerTitle="My Deployments"
      headerThemeColors={themeColors}
      searchPlaceholder="Search deployments by name..."
      searchFunction={searchFunction}
      sortOptions={sortOptions}
      filterConfigs={filterConfigs}
      filterFunction={filterFunction}
      emptyIcon={<Boxes className="h-12 w-12" />}
      emptyTitle="No Deployments"
      emptyDescription="Create one to get started"
      CreateFormComponent={CreateDeploymentFormWrapper}
      createDialogTitle="Create New Model Deployment"
    />
  );
};

// Wrapper component to match the expected onSuccess signature
const CreateDeploymentFormWrapper: React.FC<{ onSuccess: (deployment: any) => void }> = ({
  onSuccess,
}) => <ModalAppForm onSuccess={onSuccess} />;
