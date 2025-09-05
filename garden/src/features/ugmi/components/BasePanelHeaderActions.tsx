import React from "react";
import { Search, ArrowUpDown, Plus, ListFilter } from "lucide-react";
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

// Generic filtering interface
interface GenericFiltering {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOptions: Array<{ label: string; value: string }>;
  filterConfigs: Array<{ label: string; key: string; defaultChecked: boolean }>;
  filters: Record<string, boolean>;
  handleFilterToggle: (key: string) => void;
  hasActiveFilters: boolean;
}

interface BasePanelHeaderActionsProps {
  filtering: GenericFiltering;
  searchPlaceholder?: string;
  showCreateButton?: boolean;
  CreateComponent?: React.ComponentType<{ onSuccess: () => void }>;
  createDialogTitle?: string;
  onCreateSuccess?: () => void;
  isCreateDialogOpen?: boolean;
  setIsCreateDialogOpen?: (open: boolean) => void;
}

export const BasePanelHeaderActions: React.FC<BasePanelHeaderActionsProps> = ({
  filtering,
  searchPlaceholder = "Search...",
  showCreateButton = false,
  CreateComponent,
  createDialogTitle = "Create New Item",
  onCreateSuccess,
  isCreateDialogOpen = false,
  setIsCreateDialogOpen,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOptions,
    filterConfigs,
    filters,
    handleFilterToggle,
    hasActiveFilters,
  } = filtering;

  const handleCreateSuccess = () => {
    if (setIsCreateDialogOpen) {
      setIsCreateDialogOpen(false);
    }
    if (onCreateSuccess) {
      onCreateSuccess();
    }
  };

  const actions = (
    <>
      {/* Combined Sort & Filter dropdown */}
      {(sortOptions.length > 0 || filterConfigs.length > 0) && (
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
                {sortOptions.length > 0 && (
                  <>
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      {sortOptions.map((option) => (
                        <DropdownMenuRadioItem
                          key={option.value}
                          value={option.value}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                    {filterConfigs.length > 0 && (
                      <DropdownMenuSeparator />
                    )}
                  </>
                )}

                {/* Filter options */}
                {filterConfigs.map((config) => (
                  <DropdownMenuCheckboxItem
                    key={config.key}
                    checked={filters[config.key]}
                    onCheckedChange={() => handleFilterToggle(config.key)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {config.label}
                  </DropdownMenuCheckboxItem>
                ))}

                {/* Clear/Reset button */}
                {(sortOptions.length > 0 || filterConfigs.length > 0) && (searchTerm || hasActiveFilters) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        // Reset search
                        setSearchTerm('');
                        // Reset sort to default
                        setSortBy(sortOptions[0]?.value || '');
                        // Reset all filters to default values
                        filterConfigs.forEach(config => {
                          if (filters[config.key] !== config.defaultChecked) {
                            handleFilterToggle(config.key);
                          }
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
      )}

      {/* Create button */}
      {showCreateButton && CreateComponent && setIsCreateDialogOpen && (
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
              <TooltipContent>Create new {createDialogTitle.toLowerCase()}</TooltipContent>
              <DialogContent className="w-[95%] md:w-4/5 lg:w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{createDialogTitle}</DialogTitle>
                </DialogHeader>
                <CreateComponent onSuccess={handleCreateSuccess} />
              </DialogContent>
            </Dialog>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );

  const searchComponent = (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-7 pl-7 text-xs bg-white/50 border-gray-200"
      />
    </div>
  );

  return {
    actions,
    searchComponent,
  };
};