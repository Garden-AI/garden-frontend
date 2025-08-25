import React, { useState, useMemo } from "react";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { ModalFunction } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  ChevronDown,
  ChevronRight,
  Boxes,
  CircleCheck,
  CircleDotDashed,
  CircleX,
  Plus,
  ListFilter,
  Search,
  X,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/shadcn/dropdown-menu";
import { Input } from "@/components/shadcn/input";
import { ModalAppForm } from "../modal/components/ModalAppForm";

// Union type for selected items
type SelectedItem = ModelDeployment | ModalFunction | null;

type DeploymentTreeViewProps = {
  apps: ModelDeployment[];
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: SelectedItem;
};

type DeploymentFilterState = {
  deployed: boolean;
  undeployed: boolean;
  error: boolean;
};

type DeploymentSortOption = {
  label: string;
  value: string;
  sortFn: (a: ModelDeployment, b: ModelDeployment) => number;
};

export const DeploymentTreeView = ({ apps, onSelect, selectedItem }: DeploymentTreeViewProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filterState, setFilterState] = useState<DeploymentFilterState>({
    deployed: true,
    undeployed: true,
    error: true,
  });
  const [sortBy, setSortBy] = useState<string>("name");
  const auth = useGlobusAuth();

  // Define sorting options
  const sortOptions: DeploymentSortOption[] = [
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

  const handleCreateClick = async () => {
    if (!auth.isAuthenticated) {
      // Trigger login flow
      await auth.authorization?.login();
      return;
    }
    setShowCreateDialog(true);
  };

  const handleSearchToggle = () => {
    if (isSearching) {
      setSearchTerm("");
    }
    setIsSearching(!isSearching);
  };

  const handleFilterChange = (filterType: keyof DeploymentFilterState) => {
    setFilterState((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const handleResetFilters = () => {
    setFilterState({
      deployed: true,
      undeployed: true,
      error: true,
    });
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  // Filter, search, and sort apps
  const filteredApps = useMemo(() => {
    const filtered = apps.filter((app) => {
      // Apply status filters
      if (app.status === "deployed" && !filterState.deployed) return false;
      if (app.status === "undeployed" && !filterState.undeployed) return false;
      if (app.status === "error" && !filterState.error) return false;

      // Apply search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        return app.name.toLowerCase().includes(searchLower);
      }

      return true;
    });

    // Apply sorting
    const currentSortOption = sortOptions.find((option) => option.value === sortBy);
    if (currentSortOption) {
      return [...filtered].sort(currentSortOption.sortFn);
    }

    return filtered;
  }, [apps, filterState, searchTerm, sortBy, sortOptions]);

  // Check if any filters are active (not all selected)
  const hasActiveFilters = !filterState.deployed || !filterState.undeployed || !filterState.error;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-purple-300 bg-purple-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-purple-700" />
              <h2 className="text-lg font-semibold text-purple-900">My Deployments</h2>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-purple-200"
                      onClick={handleSearchToggle}
                    >
                      {isSearching ? (
                        <X className="h-4 w-4 text-purple-700" />
                      ) : (
                        <Search className="h-4 w-4 text-purple-700" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSearching ? "Close Search" : "Search Deployments"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <DropdownMenuTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-8 w-8 p-0 hover:bg-purple-200 ${
                            hasActiveFilters ? "bg-purple-200" : ""
                          }`}
                        >
                          <ListFilter className="h-4 w-4 text-purple-700" />
                        </Button>
                      </TooltipTrigger>
                    </DropdownMenuTrigger>
                    <TooltipContent>
                      <p>Filter & Sort Deployments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end" className="w-56">
                  {/* Sort Section */}
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">Sort by</div>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={sortBy === option.value ? "bg-purple-50" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* Filter Section */}
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">Show status</div>
                  <DropdownMenuCheckboxItem
                    checked={filterState.deployed}
                    onCheckedChange={() => handleFilterChange("deployed")}
                  >
                    Deployed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterState.undeployed}
                    onCheckedChange={() => handleFilterChange("undeployed")}
                  >
                    Undeployed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterState.error}
                    onCheckedChange={() => handleFilterChange("error")}
                  >
                    Error
                  </DropdownMenuCheckboxItem>

                  {hasActiveFilters && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleResetFilters}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-purple-200"
                      onClick={handleCreateClick}
                    >
                      <Plus className="h-4 w-4 text-purple-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Deployment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      {isSearching && (
        <div className="border-b border-purple-200 p-3">
          <Input
            placeholder="Search apps by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            autoFocus
          />
        </div>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {filteredApps.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <Boxes className="h-12 w-12 text-purple-300" />
            <div className="space-y-2">
              {apps.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900">No Apps</h3>
                  <p className="text-sm text-gray-500">Create one to get started</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900">No Results</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? "No apps match your search" : "No apps match your filters"}
                  </p>
                </>
              )}
            </div>
            {apps.length === 0 && (
              <Button onClick={handleCreateClick} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Create App
              </Button>
            )}
          </div>
        ) : (
          filteredApps.map((app, index) => {
            return (
              <DeploymentTreeNode
                key={index}
                app={app}
                onSelect={onSelect}
                selectedItem={selectedItem}
              />
            );
          })
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
};

type DeploymentTreeNodeProps = {
  app: ModelDeployment;
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: SelectedItem;
};

export const DeploymentTreeNode = ({ app, onSelect, selectedItem }: DeploymentTreeNodeProps) => {
  const { setNodeRef } = useDroppable({ id: app.id.toString() });
  const [isExpanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(app);
    }
  };

  // Check if this app is selected
  const isSelected =
    selectedItem &&
    "originalData" in selectedItem &&
    "status" in selectedItem &&
    selectedItem.id === app.id;

  // Get functions from the app's originalData
  const appFunctions = app.originalData?.modal_functions || [];

  // Determine app status and styling
  const getAppStatus = () => {
    switch (app.status) {
      case "deployed":
        return {
          icon: <CircleCheck className="h-4 w-4" style={{ color: "#059669" }} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-green-100",
          hoverBorder: "hover:border-green-300",
        };
      case "error":
        return {
          icon: <CircleX className="h-4 w-4" style={{ color: "#dc2626" }} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-red-100",
          hoverBorder: "hover:border-red-300",
        };
      case "undeployed":
      default:
        return {
          icon: <CircleDotDashed className="h-4 w-4" style={{ color: "#ea580c" }} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-amber-100",
          hoverBorder: "hover:border-amber-300",
        };
    }
  };

  const status = getAppStatus();

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex cursor-pointer items-center rounded-lg border-2 border-purple-400 bg-purple-50 p-2 transition-all duration-150 shadow-md`
    : `group flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`;

  return (
    <div ref={setNodeRef} className="select-none">
      <div className={containerClasses} onClick={handleSelect}>
        <button
          className="mr-2 flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
        <div className="flex flex-1 items-center gap-2">
          {status.icon}
          <div className={`truncate font-medium ${status.textColor}`}>{app.name}</div>
        </div>
      </div>
      {isExpanded && appFunctions.length > 0 && (
        <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {appFunctions.map((fn: ModalFunction, index: number) => {
            return (
              <DeploymentFunctionTreeNode
                key={index}
                fn={fn}
                onSelect={onSelect}
                selectedItem={selectedItem}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

type DeploymentFunctionTreeNodeProps = {
  fn: ModalFunction; // Modal function metadata from the app
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: SelectedItem;
};

export const DeploymentFunctionTreeNode = ({
  fn,
  onSelect,
  selectedItem,
}: DeploymentFunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `app-fn-${fn.id}` });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(fn);
    }
  };

  // Check if this function is selected
  // A function is selected if the selectedItem is a ModalFunction with matching id
  const isSelected =
    selectedItem &&
    "id" in selectedItem &&
    selectedItem.id === fn.id &&
    ("function_name" in selectedItem || "title" in selectedItem); // Make sure it's a ModalFunction

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex items-center rounded-md border-2 border-purple-400 bg-purple-50 transition-all duration-150 shadow-md`
    : `group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm`;

  return (
    <div ref={setNodeRef} className={containerClasses} style={style}>
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="mr-2 flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <div className="h-2 w-2 rounded-full bg-purple-400 transition-colors group-hover:bg-purple-500"></div>
      </div>
      {/* Clickable content */}
      <div className="flex-1 cursor-pointer px-2 py-1.5" onClick={handleSelect}>
        <div className="truncate text-sm font-medium text-gray-700">
          {fn.function_name || fn.title}
        </div>
      </div>
    </div>
  );
};
