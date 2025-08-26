import React, { useState, useMemo } from "react";
import { Garden, ModalFunction } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Sprout, Book, BookDashed, ArchiveX, Plus, ListFilter, Search, X, RotateCcw, ArrowUpDown } from "lucide-react";
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
import { CreateGardenForm } from "../gardens/components/create/CreateGardenForm";

// Union type for selected items
type SelectedItem = Garden | ModalFunction | null;

type GardenTreeViewProps = {
  gardens: Garden[];
  onSelect?: (entity: Garden | ModalFunction) => void;
  onGardenCreated?: (garden: Garden) => void;
  selectedItem?: SelectedItem;
  // Header configuration
  showHeader?: boolean;
  headerIcon?: React.ReactNode;
  headerTitle?: string;
  headerThemeColors?: {
    bg: string;
    border: string;
    text: string;
    iconColor: string;
    hoverColor: string;
    activeColor: string;
  };
};

type GardenFilterState = {
  archived: boolean;
  draft: boolean;
  published: boolean;
};

type SortOption = {
  label: string;
  value: string;
  sortFn: (a: Garden, b: Garden) => number;
};

export const GardenTreeView = ({ 
  gardens, 
  onSelect, 
  onGardenCreated, 
  selectedItem,
  showHeader = false,
  headerIcon,
  headerTitle = "Gardens",
  headerThemeColors = {
    bg: "bg-emerald-100",
    border: "border-emerald-300", 
    text: "text-emerald-900",
    iconColor: "text-emerald-700",
    hoverColor: "hover:bg-emerald-200",
    activeColor: "bg-emerald-200"
  }
}: GardenTreeViewProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filterState, setFilterState] = useState<GardenFilterState>({
    archived: true,
    draft: true,
    published: true,
  });
  const [sortBy, setSortBy] = useState<string>("title");
  const auth = useGlobusAuth();

  // Define sorting options
  const sortOptions: SortOption[] = [
    {
      label: "Title (A-Z)",
      value: "title",
      sortFn: (a, b) => a.title.localeCompare(b.title),
    },
    {
      label: "Title (Z-A)",
      value: "title-desc",
      sortFn: (a, b) => b.title.localeCompare(a.title),
    },
    {
      label: "State (Published First)",
      value: "state-published",
      sortFn: (a, b) => {
        // Order: Published (not archived, not draft) -> Draft -> Archived
        const getStateOrder = (garden: Garden) => {
          if (garden.is_archived) return 2;
          if (garden.doi_is_draft) return 1;
          return 0; // Published
        };
        return getStateOrder(a) - getStateOrder(b);
      },
    },
    {
      label: "State (Draft First)",
      value: "state-draft",
      sortFn: (a, b) => {
        // Order: Draft -> Published -> Archived
        const getStateOrder = (garden: Garden) => {
          if (garden.doi_is_draft) return 0;
          if (garden.is_archived) return 2;
          return 1; // Published
        };
        return getStateOrder(a) - getStateOrder(b);
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

  const handleFilterChange = (filterType: keyof GardenFilterState) => {
    setFilterState(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleResetFilters = () => {
    setFilterState({
      archived: true,
      draft: true,
      published: true,
    });
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  // Filter, search, and sort gardens
  const filteredGardens = useMemo(() => {
    const filtered = gardens.filter(garden => {
      // Apply status filters
      if (garden.is_archived && !filterState.archived) return false;
      if (garden.doi_is_draft && !filterState.draft) return false;
      if (!garden.is_archived && !garden.doi_is_draft && !filterState.published) return false;

      // Apply search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        return garden.title.toLowerCase().includes(searchLower) ||
          (garden.description?.toLowerCase().includes(searchLower)) ||
          (garden.authors?.some(author => author.toLowerCase().includes(searchLower)));
      }

      return true;
    });

    // Apply sorting
    const currentSortOption = sortOptions.find(option => option.value === sortBy);
    if (currentSortOption) {
      return [...filtered].sort(currentSortOption.sortFn);
    }

    return filtered;
  }, [gardens, filterState, searchTerm, sortBy, sortOptions]);

  // Check if any filters are active (not all selected)
  const hasActiveFilters = !filterState.archived || !filterState.draft || !filterState.published;

  return (
    <div className="flex h-full flex-col">
      {/* Conditional Header */}
      {showHeader && (
        <div className={`border-b-2 ${headerThemeColors.border} ${headerThemeColors.bg}`}>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {headerIcon && <div className={headerThemeColors.iconColor}>{headerIcon}</div>}
                <h2 className={`text-sm font-semibold ${headerThemeColors.text}`}>{headerTitle}</h2>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-7 w-7 p-0 ${headerThemeColors.hoverColor}`}
                        onClick={handleSearchToggle}
                      >
                        {isSearching ? (
                          <X className={`h-3 w-3 ${headerThemeColors.iconColor}`} />
                        ) : (
                          <Search className={`h-3 w-3 ${headerThemeColors.iconColor}`} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSearching ? "Close Search" : "Search Gardens"}</p>
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
                            className={`h-7 w-7 p-0 ${headerThemeColors.hoverColor} ${hasActiveFilters ? headerThemeColors.activeColor : ""}`}
                          >
                            <ListFilter className={`h-3 w-3 ${headerThemeColors.iconColor}`} />
                          </Button>
                        </TooltipTrigger>
                      </DropdownMenuTrigger>
                      <TooltipContent>
                        <p>Filter & Sort Gardens</p>
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
                        className={sortBy === option.value ? "bg-emerald-50" : ""}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Filter Section */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">Show states</div>
                    <DropdownMenuCheckboxItem
                      checked={filterState.published}
                      onCheckedChange={() => handleFilterChange("published")}
                    >
                      Published
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterState.draft}
                      onCheckedChange={() => handleFilterChange("draft")}
                    >
                      Draft
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterState.archived}
                      onCheckedChange={() => handleFilterChange("archived")}
                    >
                      Archived
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

                {onGardenCreated && (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-7 w-7 p-0 ${headerThemeColors.hoverColor}`}
                          onClick={handleCreateClick}
                        >
                          <Plus className={`h-3 w-3 ${headerThemeColors.iconColor}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create New Garden</p>
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
        <div className={`border-b ${headerThemeColors.border.replace('border-', 'border-').replace('-300', '-200')} p-3`}>
          <Input
            placeholder="Search gardens by name, description, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${headerThemeColors.border.replace('border-', 'border-').replace('-300', '-200')} focus:border-emerald-400 focus:ring-emerald-400 text-xs`}
            autoFocus
          />
        </div>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {filteredGardens.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <Sprout className="h-12 w-12 text-emerald-300" />
            <div className="space-y-2">
              {gardens.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900">No Gardens</h3>
                  <p className="text-sm text-gray-500">Create one to get started</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900">No Results</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? "No gardens match your search" : "No gardens match your filters"}
                  </p>
                </>
              )}
            </div>
            {gardens.length === 0 && (
              <Button
                onClick={handleCreateClick}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Garden
              </Button>
            )}
          </div>
        ) : (
          filteredGardens.map((g, index) => {
            return <GardenTreeNode key={index} garden={g} onSelect={onSelect} selectedItem={selectedItem} />;
          })
        )}
      </div>

      {/* Create Garden Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
          <DialogHeader>
            <DialogTitle>Create New Garden</DialogTitle>
          </DialogHeader>
          <CreateGardenForm
            onFormStateChange={() => { }}
            onSuccess={(garden) => {
              setShowCreateDialog(false);
              if (onGardenCreated) {
                onGardenCreated(garden);
              }
              if (onSelect) {
                onSelect(garden);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

type GardenTreeNodeProps = {
  garden: Garden;
  onSelect?: (entity: Garden | ModalFunction) => void;
  selectedItem?: SelectedItem;
};

export const GardenTreeNode = ({ garden, onSelect, selectedItem }: GardenTreeNodeProps) => {
  const { setNodeRef } = useDroppable({ id: garden.doi });
  const [isExpanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(garden);
    }
  };

  // Check if this garden is selected
  const isSelected = selectedItem &&
    "doi" in selectedItem &&
    "modal_functions" in selectedItem &&
    selectedItem.doi === garden.doi;

  // Determine garden state and styling
  const getGardenStatus = () => {
    if (garden.is_archived) {
      return {
        icon: <ArchiveX className="h-4 w-4 text-gray-500" />,
        textColor: "text-gray-600",
        hoverBg: "hover:bg-gray-50",
        hoverBorder: "hover:border-gray-200",
      };
    } else if (garden.doi_is_draft) {
      return {
        icon: <BookDashed className="h-4 w-4 text-amber-500" />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-amber-50",
        hoverBorder: "hover:border-amber-200",
      };
    } else {
      return {
        icon: <Book className="h-4 w-4 text-emerald-600" />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-emerald-50",
        hoverBorder: "hover:border-emerald-200",
      };
    }
  };

  const status = getGardenStatus();

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex cursor-pointer items-center rounded-lg border-2 border-emerald-400 bg-emerald-50 p-2 transition-all duration-150 shadow-md`
    : `group flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`;

  return (
    <div ref={setNodeRef} className="select-none">
      <div
        className={containerClasses}
        onClick={handleSelect}
      >
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
        <div className="flex items-center gap-2">
          {status.icon}
          <div className={`truncate font-medium ${status.textColor}`}>{garden.title}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {garden.modal_functions?.map((fn, index) => {
            return <FunctionTreeNode key={index} fn={fn} onSelect={onSelect} selectedItem={selectedItem} />;
          })}
        </div>
      )}
    </div>
  );
};

type FunctionTreeNodeProps = {
  fn: ModalFunction;
  onSelect?: (entity: Garden | ModalFunction) => void;
  selectedItem?: SelectedItem;
};

export const FunctionTreeNode = ({ fn, onSelect, selectedItem }: FunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fn.id });

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
  const isSelected = selectedItem &&
    "id" in selectedItem &&
    selectedItem.id === fn.id &&
    (("function_name" in selectedItem) || ("title" in selectedItem)); // Make sure it's a ModalFunction

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex items-center rounded-md border-2 border-blue-400 bg-blue-50 transition-all duration-150 shadow-md`
    : `group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm`;

  return (
    <div
      ref={setNodeRef}
      className={containerClasses}
      style={style}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="mr-2 flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <div className="h-2 w-2 rounded-full bg-blue-400 transition-colors group-hover:bg-blue-500"></div>
      </div>
      {/* Clickable content */}
      <div className="flex-1 cursor-pointer px-2 py-1.5" onClick={handleSelect}>
        <div className="truncate text-sm font-medium text-gray-700">{fn.function_name}</div>
      </div>
    </div>
  );
};
