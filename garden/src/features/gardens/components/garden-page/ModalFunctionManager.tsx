import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Garden } from '@/types';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shadcn/table";
import { toast } from 'sonner';
import { useGetUserModalFunctions } from '@/features/modal/api/useGetUserModalFunctions';
import { usePatchGarden } from '@/features/gardens/api/usePatchGarden';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ModalFunctionManagerProps {
  garden: Garden;
  onSuccess?: () => void;
}

const ModalFunctionManager: React.FC<ModalFunctionManagerProps> = ({
  garden,
  onSuccess
}) => {
  const navigate = useNavigate();
  const modalAppId = garden.modal_functions?.[0]?.modal_app_id;

  // Get current function IDs to exclude from the selection
  const currentFunctionIds = garden.modal_functions?.map(f => f.id) || [];

  // State for selected function IDs
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<number[]>(currentFunctionIds);
  const [showFullDescriptionIds, setShowFullDescriptionIds] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Sync selected functions
  useEffect(() => {
    if (isDialogOpen) {
      setSelectedFunctionIds(garden.modal_functions?.map(f => f.id) || []);
    }
  }, [isDialogOpen, garden.modal_functions]);

  // Get user's modal functions - only fetch when dialog is opened
  const {
    data: functions,
    refetch,
    isFetching,
    isLoading
  } = useGetUserModalFunctions({ enabled: isDialogOpen });

  const { mutateAsync: patchGarden } = usePatchGarden();

  // Handle checkbox change
  const handleFunctionToggle = (functionId: number) => {
    setSelectedFunctionIds(prev =>
      prev.includes(functionId)
        ? prev.filter(id => id !== functionId)
        : [...prev, functionId]
    );
  };

  // Handle saving functions to the garden
  const handleSave = async () => {
    try {
      const addedCount = selectedFunctionIds.filter(id => !currentFunctionIds.includes(id)).length;
      const removedCount = currentFunctionIds.filter(id => !selectedFunctionIds.includes(id)).length;

      let successMessage = "Garden functions updated successfully";
      if (addedCount > 0 && removedCount > 0) {
        successMessage = `Added ${addedCount} and removed ${removedCount} functions`;
      } else if (addedCount > 0) {
        successMessage = `Added ${addedCount} function${addedCount > 1 ? 's' : ''}`;
      } else if (removedCount > 0) {
        successMessage = `Removed ${removedCount} function${removedCount > 1 ? 's' : ''}`;
      }

      // Update the garden with the new set of functions
      await patchGarden({
        doi: garden.doi,
        garden: {
          modal_function_ids: selectedFunctionIds
        },
        successMessage
      });

      setIsDialogOpen(false);

      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to update garden functions");
      console.error('Error updating garden functions:', error);
    }
  };

  const filteredFunctions = functions?.filter((func) => {
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = `${func.title ?? ''} ${func.function_name ?? ''} ${func.description ?? ''}`.toLowerCase();
    return queryWords.every((word) => haystack.includes(word));
  });

  return (
    <>
    {isDialogOpen !== undefined && (
    <div className="flex gap-2 mt-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add/Remove functions
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(`/model-deployments/${modalAppId}`)}
      >
        Manage Deployment
      </Button>
    </div>
    )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Garden Functions</DialogTitle>
          </DialogHeader>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Select functions to include in this garden:
            </p>
          </div>

          {selectedFunctionIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedFunctionIds.map((id) => {
                const func = functions?.find(f => f.id == id);
                if (!func) return null;

                return (
                  <div
                    key={id}
                    className="flex items-center rounded-full bg-[#e0f3e7] text-sm px-3 py-1 border border-[#b3dbc3]"
                  >
                    {func.title || func.function_name}
                    <button
                      onClick={() => handleFunctionToggle(id)}
                      className="ml-2 text-[#2f5d41] hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {selectedFunctionIds.length > 0 && (
            <div className="mt-2 mb-4">
              <button onClick={() => setIsConfirmClearOpen(true)}
                className="text-sm text-[#2f5d41] bg-white hover:bg-[#f0f5f3] border border-[#b3dbc3] px-3 py-1 rounded-md shadow-sm transition flex items-center gap-1">
                Clear all selected
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cae4f]"
          />

          <div className="relative mb-4 rounded-md border bg-white">
            <div className="max-h-[420px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-1/12"></TableHead>
                    <TableHead className="w-1/4">Name</TableHead>
                    <TableHead className="w-1/2">Description</TableHead>
                    <TableHead className="w-1/6 text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        <div className="flex h-24 items-center justify-center">
                          <LoadingSpinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : functions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No modal functions available
                      </TableCell>
                    </TableRow>
                  ) : filteredFunctions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No functions match your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (filteredFunctions ?? []).map((func) => (
                      <TableRow
                        key={func.id}
                        onClick={() => handleFunctionToggle(func.id)}
                        className={`
                            group cursor-pointer transition-all duration-200 ease-in-out rounded-md
                            ${selectedFunctionIds.includes(func.id)
                            ? "bg-[#e0f3e7] border-y border-[#5cae4f] shadow-sm"
                            : "hover:bg-[#eef5f1]"}  
                          `}
                      >
                        <TableCell className="w-1/12 text-center">
                          <Checkbox
                            checked={selectedFunctionIds.includes(func.id)}
                            onCheckedChange={() => handleFunctionToggle(func.id)}
                            onClick={(e) => e.stopPropagation()}
                            value={func.id}
                          />
                        </TableCell>
                        <TableCell className="w-1/4 truncate whitespace-normal break-words">
                          {func.title || func.function_name}
                        </TableCell>
                        <TableCell className="w-1/2 whitespace-normal break-words text-sm text-gray-700">
                          <div>
                            <p className={showFullDescriptionIds.includes(func.id) ? '' : 'line-clamp-2'}>
                              {func.description || "No description available"}
                            </p>
                            {func.description && func.description.length > 120 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowFullDescriptionIds((prev) =>
                                    prev.includes(func.id) ? prev.filter((id) => id !== func.id) : [...prev, func.id]
                                  );
                                }}
                                className="mt-1 text-xs text-green hover:underline"
                              >
                                {showFullDescriptionIds.includes(func.id) ? "Show less" : "Show more"}
                              </button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-1/6 text-center">
                          <Link
                            to={`/modal-functions/${func.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" type="button">
                              View
                              <ExternalLink size={14} className="mb-0.5 ml-1" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Update Garden
            </Button>
          </div>

          <Dialog open={isConfirmClearOpen} onOpenChange={setIsConfirmClearOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Remove all selected functions?</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-gray-600">
                Your current selections will be cleared. This won't affect the garden until changes are confirmed.
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsConfirmClearOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => {
                  setSelectedFunctionIds([]);
                  setIsConfirmClearOpen(false);
                }}>
                  Clear All
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalFunctionManager; 