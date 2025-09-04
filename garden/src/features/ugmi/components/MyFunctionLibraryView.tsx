import React, { useState, useMemo } from "react";
import { Library, Search, Filter, ArrowUpDown, Plus, ListFilter } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/shadcn/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { ModalAppForm } from "../../modal/components/ModalAppForm";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { TreeView } from "./TreeView";
import { DeploymentTreeNode } from "./DeploymentTreeNode";
import { PanelHeader } from "./PanelHeader";
import { useSelection } from "../hooks";

type Entity = Garden | ModalFunction | ModelDeployment;

export type FunctionLibraryViewProps = {
  modelDeployments: ModelDeployment[];
  gardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onDoubleClick?: () => void;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
  selectedItem?: Entity | null;
  selection?: ReturnType<typeof useSelection>;
  isLoading?: boolean;
};

export const MyFunctionLibraryView = ({
  modelDeployments,
  gardens,
  onSelect,
  onDoubleClick,
  onDeploymentCreated,
  selectedItem,
  selection,
  isLoading = false,
}: FunctionLibraryViewProps) => {
  const [expandedDeployments, setExpandedDeployments] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filters, setFilters] = useState({
    deployed: true,
    undeployed: true,
    error: true,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

  // Filter and sort deployments
  const filteredAndSortedDeployments = useMemo(() => {
    let filtered = modelDeployments.filter(deployment => {
      // Apply status filters
      if (deployment.status === "deployed" && !filters.deployed) return false;
      if (deployment.status === "undeployed" && !filters.undeployed) return false;
      if (deployment.status === "error" && !filters.error) return false;

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = deployment.name.toLowerCase().includes(searchLower);
        const functionsMatch = deployment.originalData?.modal_functions?.some(func =>
          func.function_name?.toLowerCase().includes(searchLower) ||
          func.title?.toLowerCase().includes(searchLower) ||
          func.description?.toLowerCase().includes(searchLower)
        );
        return nameMatch || functionsMatch;
      }

      return true;
    });

    // Sort deployments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "status-deployed":
          const statusOrder = { deployed: 0, undeployed: 1, error: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return filtered;
  }, [modelDeployments, searchTerm, sortBy, filters]);

  const handleFilterToggle = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
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

  const hasActiveFilters = !filters.deployed || !filters.undeployed || !filters.error;

  const headerActions = (
    <>
      {/* Combined Sort & Filter dropdown */}
      <TooltipProvider>
        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ListFilter className={`h-4 w-4 ${hasActiveFilters ? 'text-blue-600' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Sort and filter options</TooltipContent>
            <DropdownMenuContent align="end">
              {/* Sort options */}
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="name" onSelect={(e) => e.preventDefault()}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Name (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc" onSelect={(e) => e.preventDefault()}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Name (Z-A)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status-deployed" onSelect={(e) => e.preventDefault()}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Status (Deployed First)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              {/* Filter options */}
              <DropdownMenuCheckboxItem
                checked={filters.deployed}
                onCheckedChange={() => handleFilterToggle('deployed')}
                onSelect={(e) => e.preventDefault()}
              >
                Deployed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.undeployed}
                onCheckedChange={() => handleFilterToggle('undeployed')}
                onSelect={(e) => e.preventDefault()}
              >
                In-Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.error}
                onCheckedChange={() => handleFilterToggle('error')}
                onSelect={(e) => e.preventDefault()}
              >
                Error
              </DropdownMenuCheckboxItem>

              {/* Reset button */}
              {(searchTerm || hasActiveFilters) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      // Reset search
                      setSearchTerm('');
                      // Reset sort to default
                      setSortBy('name');
                      // Reset all filters to default values
                      setFilters({
                        deployed: true,
                        undeployed: true,
                        error: true,
                      });
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Reset
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </TooltipProvider>

      {/* Create button */}
      <TooltipProvider>
        <Tooltip>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Create new function</TooltipContent>
            <DialogContent className="w-[95%] md:w-4/5 lg:w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Function</DialogTitle>
              </DialogHeader>
              <CreateFunctionFormWrapper onSuccess={handleCreateSuccess} onDeploymentCreated={onDeploymentCreated} />
            </DialogContent>
          </Dialog>
        </Tooltip>
      </TooltipProvider>
    </>
  );

  const searchComponent = (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search my functions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-7 pl-7 text-xs bg-white/50 border-gray-200"
      />
    </div>
  );

  return (
    <div className="h-full bg-blue-50 rounded-lg">
      <PanelHeader
        icon={<Library className="h-5 w-5" />}
        title="My Function Library"
        count={filteredAndSortedDeployments.length}
        onDoubleClick={onDoubleClick}
        themeColors={themeColors}
        actions={headerActions}
        searchComponent={searchComponent}
        showSearchToggle={true}
      />

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : filteredAndSortedDeployments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
            <Library className="h-12 w-12 text-gray-300" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                {modelDeployments.length === 0 ? "No Functions Found" : "No matches found"}
              </p>
              <p className="text-xs text-gray-500">
                {modelDeployments.length === 0 ? "Deploy a new function to get started" : "Try adjusting your search or filters"}
              </p>
            </div>
          </div>
        ) : (
          <TreeView>
            {filteredAndSortedDeployments.map(deployment => (
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

// Wrapper component to match the expected onSuccess signature  
const CreateFunctionFormWrapper: React.FC<{
  onSuccess: (fn: Entity) => void;
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
      onSuccess({ id } as Entity);
    }}
  />
);

