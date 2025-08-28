import React, { useState, useMemo, ReactNode } from "react";
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
import { ListFilter, Search, X, RotateCcw, Plus } from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";

// Generic types for tree structure
export type TreeNode<TParent = any, TChild = any> = {
  parent: TParent;
  children: TChild[];
};

export type FilterState = Record<string, boolean>;

export type SortOption<T> = {
  label: string;
  value: string;
  sortFn: (a: T, b: T) => number;
};

export type ThemeColors = {
  bg: string;
  border: string;
  text: string;
  iconColor: string;
  hoverColor: string;
  activeColor: string;
};

export type SearchFunction<TParent, TChild> = (
  node: TreeNode<TParent, TChild>,
  searchTerm: string,
) => boolean;

export type FilterFunction<TParent, TChild> = (
  node: TreeNode<TParent, TChild>,
  filterState: FilterState,
) => boolean;

// Node renderer props
export type ParentNodeProps<TParent, TChild> = {
  item: TParent;
  children: TChild[];
  onSelect?: (item: TParent | TChild) => void;
  selectedItem?: any;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  themeColors: ThemeColors;
};

export type ChildNodeProps<TParent, TChild> = {
  item: TChild;
  parent: TParent;
  onSelect?: (item: TParent | TChild) => void;
  selectedItem?: any;
  themeColors: ThemeColors;
};

// Filter configuration
export type FilterConfig = {
  label: string;
  key: string;
  defaultChecked: boolean;
};

export type BaseTreeViewProps<TParent, TChild> = {
  // Data
  data: TreeNode<TParent, TChild>[];

  // Node renderers
  ParentNodeComponent: React.ComponentType<ParentNodeProps<TParent, TChild>>;
  ChildNodeComponent: React.ComponentType<ChildNodeProps<TParent, TChild>>;

  // Callbacks
  onSelect?: (item: TParent | TChild) => void;
  onDoubleClick?: () => void;
  onCreate?: () => void;
  onCreateSuccess?: (item: any) => void;

  // Selection
  selectedItem?: any;

  // Header configuration
  showHeader?: boolean;
  headerIcon?: ReactNode;
  headerTitle?: string;
  headerThemeColors?: ThemeColors;

  // Search configuration
  searchPlaceholder?: string;
  searchFunction: SearchFunction<TParent, TChild>;

  // Filter/sort configuration
  sortOptions: SortOption<TParent>[];
  filterConfigs: FilterConfig[];
  filterFunction: FilterFunction<TParent, TChild>;

  // Empty state
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;

  // Create dialog
  CreateFormComponent?: React.ComponentType<{ onSuccess: (item: any) => void }>;
  createDialogTitle?: string;

  // Compact mode
  isCompact?: boolean;
};

const defaultTheme: ThemeColors = {
  bg: "bg-gray-100",
  border: "border-gray-300",
  text: "text-gray-900",
  iconColor: "text-gray-700",
  hoverColor: "hover:bg-gray-200",
  activeColor: "bg-gray-200",
};

export function BaseTreeView<TParent, TChild>({
  data,
  ParentNodeComponent,
  ChildNodeComponent,
  onSelect,
  onDoubleClick = () => {},
  onCreate,
  onCreateSuccess,
  selectedItem,
  showHeader = false,
  headerIcon,
  headerTitle = "Items",
  headerThemeColors = defaultTheme,
  searchPlaceholder = "Search items...",
  searchFunction,
  sortOptions,
  filterConfigs,
  filterFunction,
  emptyIcon,
  emptyTitle = "No Items",
  emptyDescription = "Create one to get started",
  CreateFormComponent,
  createDialogTitle = "Create New Item",
  isCompact = false,
}: BaseTreeViewProps<TParent, TChild>) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Initialize filter state from config
  const initialFilterState = useMemo(() => {
    const state: FilterState = {};
    filterConfigs.forEach((config) => {
      state[config.key] = config.defaultChecked;
    });
    return state;
  }, [filterConfigs]);

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [sortBy, setSortBy] = useState<string>(sortOptions[0]?.value || "");
  const auth = useGlobusAuth();

  const handleCreateClick = async () => {
    if (!auth.isAuthenticated) {
      await auth.authorization?.login();
      return;
    }
    if (onCreate) {
      onCreate();
    } else {
      setShowCreateDialog(true);
    }
  };

  const handleSearchToggle = () => {
    if (isSearching) {
      setSearchTerm("");
    }
    setIsSearching(!isSearching);
  };

  const handleFilterChange = (filterKey: string) => {
    setFilterState((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const handleResetFilters = () => {
    setFilterState(initialFilterState);
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const handleToggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Filter, search, and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((node) => {
      // Apply filters
      if (!filterFunction(node, filterState)) return false;

      // Apply search
      if (searchTerm.trim() && !searchFunction(node, searchTerm)) return false;

      return true;
    });

    // Apply sorting
    const currentSortOption = sortOptions.find((option) => option.value === sortBy);
    if (currentSortOption) {
      filtered = [...filtered].sort((a, b) => currentSortOption.sortFn(a.parent, b.parent));
    }

    return filtered;
  }, [data, filterState, searchTerm, sortBy, filterFunction, searchFunction, sortOptions]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filterState).some(([key, value]) => {
      const config = filterConfigs.find((c) => c.key === key);
      return config && value !== config.defaultChecked;
    });
  }, [filterState, filterConfigs]);

  const hasData = data.length > 0;
  const hasResults = filteredAndSortedData.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      {showHeader && (
        <div
          className={`rounded-lg border-b-2 ${headerThemeColors.border} ${headerThemeColors.bg}`}
          onDoubleClick={onDoubleClick}
        >
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {headerIcon && <div className={headerThemeColors.iconColor}>{headerIcon}</div>}
                <h2 className={`text-sm font-semibold ${headerThemeColors.text}`}>{headerTitle}</h2>
              </div>
              <div className="flex items-center gap-1">
                {/* Search Toggle */}
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 p-0 transition-colors hover:shadow-sm ${headerThemeColors.hoverColor}`}
                        onClick={handleSearchToggle}
                      >
                        {isSearching ? (
                          <X className={`h-4 w-4 ${headerThemeColors.iconColor}`} />
                        ) : (
                          <Search className={`h-4 w-4 ${headerThemeColors.iconColor}`} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSearching ? "Close Search" : "Search"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Filter/Sort Menu */}
                <DropdownMenu>
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <DropdownMenuTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-8 w-8 p-0 transition-colors hover:shadow-sm ${headerThemeColors.hoverColor} ${
                              hasActiveFilters ? headerThemeColors.activeColor : ""
                            }`}
                          >
                            <ListFilter className={`h-4 w-4 ${headerThemeColors.iconColor}`} />
                          </Button>
                        </TooltipTrigger>
                      </DropdownMenuTrigger>
                      <TooltipContent>
                        <p>Filter & Sort</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenuContent align="end" className="w-56">
                    {/* Sort Section */}
                    {sortOptions.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
                          Sort by
                        </div>
                        {sortOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={
                              sortBy === option.value
                                ? headerThemeColors.activeColor
                                    .replace("bg-", "bg-")
                                    .replace("-200", "-50")
                                : ""
                            }
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {/* Filter Section */}
                    {filterConfigs.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
                          Show items
                        </div>
                        {filterConfigs.map((config) => (
                          <DropdownMenuCheckboxItem
                            key={config.key}
                            checked={filterState[config.key]}
                            onCheckedChange={() => handleFilterChange(config.key)}
                          >
                            {config.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </>
                    )}

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

                {/* Create Button */}
                {(onCreate || CreateFormComponent) && (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 p-0 transition-colors hover:shadow-sm ${headerThemeColors.hoverColor}`}
                          onClick={handleCreateClick}
                        >
                          <Plus className={`h-4 w-4 ${headerThemeColors.iconColor}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create New</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      {isSearching && (
        <div
          className={`border-b ${headerThemeColors.border.replace("border-", "border-").replace("-300", "-200")} p-3`}
        >
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${headerThemeColors.border.replace("border-", "border-").replace("-300", "-200")} text-xs focus:border-${headerThemeColors.border.split("-")[1]}-400 focus:ring-${headerThemeColors.border.split("-")[1]}-400`}
            autoFocus
          />
        </div>
      )}

      {/* Content */}
      <div className="scrollbar-thin scrollbar-track-transparent flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2">
        {!hasResults ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            {emptyIcon && <div className="text-gray-300">{emptyIcon}</div>}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {!hasData ? emptyTitle : "No Results"}
              </h3>
              <p className="text-sm text-gray-500">
                {!hasData
                  ? emptyDescription
                  : searchTerm
                    ? "No items match your search"
                    : "No items match your filters"}
              </p>
            </div>
            {!hasData && (onCreate || CreateFormComponent) && (
              <Button
                onClick={handleCreateClick}
                className={`bg-${headerThemeColors.border.split("-")[1]}-600 hover:bg-${headerThemeColors.border.split("-")[1]}-700`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            )}
          </div>
        ) : (
          filteredAndSortedData.map((node, index) => {
            const parentId = `parent-${index}`;
            const isExpanded = expandedItems.has(parentId);

            return (
              <div key={index}>
                <ParentNodeComponent
                  item={node.parent}
                  children={node.children}
                  onSelect={onSelect}
                  selectedItem={selectedItem}
                  isExpanded={isExpanded}
                  onToggleExpanded={() => handleToggleExpanded(parentId)}
                  themeColors={headerThemeColors}
                />

                {isExpanded && node.children.length > 0 && (
                  <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {node.children.map((child, childIndex) => (
                      <ChildNodeComponent
                        key={childIndex}
                        item={child}
                        parent={node.parent}
                        onSelect={onSelect}
                        selectedItem={selectedItem}
                        themeColors={headerThemeColors}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Dialog */}
      {CreateFormComponent && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
            <DialogHeader>
              <DialogTitle>{createDialogTitle}</DialogTitle>
            </DialogHeader>
            <CreateFormComponent
              onSuccess={(item) => {
                setShowCreateDialog(false);
                if (onCreateSuccess) {
                  onCreateSuccess(item);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
