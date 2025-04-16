import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ModalFunctionManagerProps {
  garden: Garden;
  onSuccess?: () => void;
}

const ModalFunctionManager: React.FC<ModalFunctionManagerProps> = ({
  garden,
  onSuccess
}) => {
  // Get current function IDs to exclude from the selection
  const currentFunctionIds = garden.modal_functions?.map(f => f.id) || [];
  
  // State for selected function IDs
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<number[]>(currentFunctionIds);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get user's modal functions
  const {
    data: functions,
    refetch,
    isFetching,
    isLoading
  } = useGetUserModalFunctions();
  
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
  
  // Don't render if there are no functions available
  if ((functions?.length || 0) === 0 && !isLoading && !isFetching) return null;
  
  return (
    <>
      <Button 
        type="button" 
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add/Remove functions
      </Button>
      
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
                  ) : (
                    functions?.map((func) => (
                      <TableRow key={func.id}>
                        <TableCell className="w-1/12 text-center">
                          <Checkbox
                            checked={selectedFunctionIds.includes(func.id)}
                            onCheckedChange={() => handleFunctionToggle(func.id)}
                            value={func.id}
                          />
                        </TableCell>
                        <TableCell className="w-1/4 truncate whitespace-normal break-words">
                          {func.title || func.function_name}
                        </TableCell>
                        <TableCell className="w-1/2 truncate whitespace-normal break-words">
                          {func.description || "No description available"}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalFunctionManager; 