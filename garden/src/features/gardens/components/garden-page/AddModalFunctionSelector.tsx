import React, { useState } from 'react';
import { PlusCircle, RefreshCcwIcon } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Garden, ModalFunction } from '@/types';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
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
import WithTooltip from '@/components/WithTooltip';
import { cn } from '@/utils/form.utils';

interface AddModalFunctionSelectorProps {
  garden: Garden;
  onSuccess?: () => void;
}

const AddModalFunctionSelector: React.FC<AddModalFunctionSelectorProps> = ({
  garden,
  onSuccess
}) => {
  // Get current function IDs to exclude from the selection
  const currentFunctionIds = garden.modal_functions?.map(f => f.id) || [];
  
  // State for selected function IDs
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get user's modal functions
  const {
    data: functions,
    refetch,
    isFetching,
    isLoading
  } = useGetUserModalFunctions({
    excludeFunctionIds: currentFunctionIds,
  });
  
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
    if (selectedFunctionIds.length === 0) {
      toast.error("Please select at least one function");
      return;
    }
    
    try {
      // Get the selected functions
      const selectedFunctions = functions?.filter(f => selectedFunctionIds.includes(f.id)) || [];
      
      // Get current modal functions from garden
      const currentFunctions = garden.modal_functions || [];
      
      // Add new functions to existing ones
      const updatedFunctions = [...currentFunctions, ...selectedFunctions];
      
      // Update the garden with the new functions
      await patchGarden({
        doi: garden.doi,
        garden: {
          modal_function_ids: updatedFunctions.map(f => f.id)
        }
      });
      
      toast.success("Functions added to garden successfully");
      setIsDialogOpen(false);
      setSelectedFunctionIds([]);
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to add functions to garden");
      console.error('Error adding functions to garden:', error);
    }
  };
  
  // Don't render if there are no available functions to add
  if ((functions?.length || 0) === 0 && !isLoading && !isFetching) return null;
  
  return (
    <>
      <Button 
        type="button" 
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add function
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Functions to Garden</DialogTitle>
          </DialogHeader>
          
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Select functions to add to this garden:
            </p>
            <div className="flex items-center pr-4 text-sm">
              <span className="text-gray-500">{isFetching && "Refreshing..."}</span>
              <WithTooltip hint="Refresh functions list">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  type="button"
                  disabled={isFetching}
                  className={cn(
                    "border-none bg-transparent p-2 hover:bg-transparent",
                    isFetching && "cursor-not-allowed opacity-50",
                  )}
                >
                  <RefreshCcwIcon className={cn("h-5 w-5", isFetching && "animate-spin")} />
                </Button>
              </WithTooltip>
            </div>
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
                        No additional modal functions available
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
            <Button onClick={handleSave} disabled={selectedFunctionIds.length === 0}>
              Add to Garden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddModalFunctionSelector; 