import React, { useState, useCallback } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shadcn/table";
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ModalFunction } from '@/types';
import { GardenFunction as Function } from '@/features/functions/shared/types/function.types';
import { toast } from 'sonner';
import { Badge } from '@/components/shadcn/badge';

interface FunctionSelectionTableProps {
  functions: Function[] | undefined;
  selectedFunctionIds?: (string | number)[];
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSelectedChips?: boolean;
  showClearAllButton?: boolean;
  showSearch?: boolean;
  maxHeight?: string;
  onFunctionAdded?: (functionId: string | number, authorIds: string[]) => void;
  onFunctionRemoved?: (functionId: string | number) => void;
  className?: string;
  tableClassName?: string;
}

const FunctionSelectionTable: React.FC<FunctionSelectionTableProps> = ({
  functions,
  selectedFunctionIds = [],
  onSelectionChange,
  isLoading = false,
  isFetching = false,
  searchQuery = "",
  onSearchChange,
  showSelectedChips = true,
  showClearAllButton = true,
  showSearch = true,
  maxHeight = "420px",
  onFunctionAdded,
  onFunctionRemoved,
  className = "",
  tableClassName = ""
}) => {
  const [showFullDescriptionIds, setShowFullDescriptionIds] = useState<(string | number)[]>([]);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const filteredFunctions = (functions ?? []).filter((func) => {
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = `${func.title ?? ''} ${func.function_name ?? ''} ${func.description ?? ''}`.toLowerCase();
    return queryWords.every((word) => haystack.includes(word));
  });

  // Helper to create composite key from function
  const getFunctionCompositeKey = (func: Function): string => {
    return `${func.functionType}-${func.id}`;
  };

  const handleFunctionToggle = useCallback(
    (func: Function) => {
      const compositeKey = getFunctionCompositeKey(func);
      const isCurrentlySelected = selectedFunctionIds.includes(compositeKey);
      const newSelectedIds = isCurrentlySelected
        ? selectedFunctionIds.filter(id => id !== compositeKey)
        : [...selectedFunctionIds, compositeKey];

      onSelectionChange(newSelectedIds);

      if (!isCurrentlySelected && onFunctionAdded) {
        const authorIds = func.authors ?? [];
        if (authorIds.length === 0) {
          toast.warning(`Function "${func.title || func.function_name}" has no authors defined`);
        }
        onFunctionAdded(compositeKey, authorIds);
      } else if (isCurrentlySelected && onFunctionRemoved) {
        onFunctionRemoved(compositeKey);
      }
    },
    [selectedFunctionIds, onSelectionChange, onFunctionAdded, onFunctionRemoved]
  );

  const handleClearAll = () => {
    onSelectionChange([]);
    setIsConfirmClearOpen(false);
  };

  const toggleDescription = (functionId: string | number) => {
    setShowFullDescriptionIds((prev) =>
      prev.includes(functionId)
        ? prev.filter((id) => id !== functionId)
        : [...prev, functionId]
    );
  };

  
  return (
    <div className={className}>
      {showSelectedChips && selectedFunctionIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedFunctionIds.map((compositeKey) => {
            const func = functions?.find(f => getFunctionCompositeKey(f) === compositeKey);
            if (!func) return null;

            return (
              <div
                key={compositeKey}
                className="flex items-center rounded-full bg-[#e0f3e7] text-sm px-3 py-1 border border-[#b3dbc3]"
              >
                {func.title || func.function_name}
                <button
                  onClick={() => handleFunctionToggle(func)}
                  className="ml-2 text-[#2f5d41] hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showClearAllButton && selectedFunctionIds.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setIsConfirmClearOpen(true)}
            className="text-sm text-[#2f5d41] bg-white hover:bg-[#f0f5f3] border border-[#b3dbc3] px-3 py-1 rounded-md shadow-sm transition flex items-center gap-1"
          >
            Clear all selected
          </button>
        </div>
      )}

      {showSearch && onSearchChange && (
        <input
          type="text"
          placeholder="Search functions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cae4f] mb-4"
        />
      )}

      <div className={`relative rounded-md border bg-white ${tableClassName}`}>
        <div className="overflow-y-auto" style={{ maxHeight }}>
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-1/12"></TableHead>
                <TableHead className="w-auto">Type</TableHead>
                <TableHead className="w-1/4">Name</TableHead>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className="w-1/6 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="flex h-24 items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : functions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No functions available
                  </TableCell>
                </TableRow>
              ) : filteredFunctions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No functions match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFunctions.map((func) => {
                  const compositeKey = getFunctionCompositeKey(func);
                  return (
                  <TableRow
                    key={compositeKey}
                    onClick={(e) => {
                      const tag = (e.target as HTMLElement).tagName.toLowerCase();
                      if (['input', 'button', 'svg', 'path', 'a'].includes(tag)) return;
                      handleFunctionToggle(func);
                    }}
                    className={`group cursor-pointer transition-all duration-200 ease-in-out rounded-md
                      ${selectedFunctionIds.includes(compositeKey)
                        ? "bg-[#e0f3e7] border-y border-[#5cae4f] shadow-sm"
                        : "hover:bg-[#eef5f1]"}`}
                  >
                    <TableCell className="w-1/12 text-center">
                      <Checkbox
                        checked={selectedFunctionIds.includes(compositeKey)}
                        onCheckedChange={() => handleFunctionToggle(func)}
                        onPointerDown={(e) => e.stopPropagation()}
                        value={compositeKey}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={func.functionType === 'modal' ? 'default' : 'secondary'}>
                        {func.functionType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-1/4 truncate whitespace-normal break-words">
                      {func.title || func.function_name}
                    </TableCell>
                    <TableCell className="w-1/2 whitespace-normal break-words text-sm text-gray-700">
                      <div>
                        <p className={showFullDescriptionIds.includes(compositeKey) ? '' : 'line-clamp-2'}>
                          {func.description || "No description available"}
                        </p>
                        {func.description && func.description.length > 120 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(compositeKey);
                            }}
                            className="mt-1 text-xs text-green hover:underline"
                          >
                            {showFullDescriptionIds.includes(compositeKey) ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-1/6 text-center">
                      {func.functionType === 'modal' && (
                        <Link
                          to={`/modal-functions/${func.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="outline" size="sm" type="button">
                            View
                            <ExternalLink size={14} className="mb-0.5 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isConfirmClearOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Remove all selected functions?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your current selections will be cleared. This won't affect the garden until changes are confirmed.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsConfirmClearOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunctionSelectionTable;
