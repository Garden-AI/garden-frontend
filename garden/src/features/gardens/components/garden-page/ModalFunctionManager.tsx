import React, { useState, useEffect } from 'react';
import { PlusCircle, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Garden } from '@/types';
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
// import { useGetUserModalFunctions } from '@/features/modal/api/useGetUserModalFunctions';
import { useGetAllModalFunctions } from '@/features/modal/api/useGetAllModalFunctions';
import { usePatchGarden } from '@/features/gardens/api/usePatchGarden';
import { Link, useNavigate } from 'react-router-dom';
// import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetModelDeployments } from '@/features/model-deployments/api/useGetModelDeployments';
import { useGetUserInfo } from '@/features/users/api/useGetUserInfo';
import FunctionSelectionTable from '@/features/modal/components/FunctionSelectionTable';

interface ModalFunctionManagerProps {
  garden: Garden;
  onSuccess?: () => void;
}

const ModalFunctionManager: React.FC<ModalFunctionManagerProps> = ({
  garden,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetUserInfo();
  const modalAppId = garden.modal_functions?.[0]?.modal_app_id;

  // Get current function IDs to exclude from the selection
  const currentFunctionIds = garden.modal_functions?.map(f => f.id) || [];

  // State for selected function IDs
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<number[]>(currentFunctionIds);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeploymentDialogOpen, setIsDeploymentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get modal functions - only fetch when dialog is opened
  const {
    data: functions,
    refetch,
    isFetching,
    isLoading
  } = useGetAllModalFunctions();

  // Sync selected functions
  useEffect(() => {
    if (isDialogOpen && functions && functions.length > 0) {
      const syncedIds = garden.modal_functions
        ?.map(f => f.id)
        .filter(id => functions.some(func => func.id === id)) || [];
      setSelectedFunctionIds(syncedIds);
    }
  }, [isDialogOpen, garden.modal_functions, functions]);

  // Sync model authors
  useEffect(() => {
    if (isDialogOpen) {
      setSelectedFunctionIds(garden.modal_functions?.map(f => f.id) || []);

      const initialAuthorIds = new Set<string>();
      garden.modal_functions?.forEach(fn => {
        fn.authors?.forEach(identity_id => {
          if (identity_id) {
            initialAuthorIds.add(identity_id);
          }
        });
      });

      setSelectedAuthorIds(initialAuthorIds);
    }
  }, [isDialogOpen, garden.modal_functions]);

  const { mutateAsync: patchGarden } = usePatchGarden();

  const { data: modelDeployments } = useGetModelDeployments();

  const handleFunctionAdded = (functionId: number, authorIds: string[]) => {
    setSelectedAuthorIds(prev => {
      const newSet = new Set(prev);
      authorIds.forEach(id => {
        if (id) {
          newSet.add(id);
        }
      });
      return newSet;
    });
  };

  const handleFunctionRemoved = (functionId: number) => {
    const removedFunction = garden.modal_functions?.find(f => f.id === functionId);
    const removedAuthorIds = removedFunction?.authors || [];

    setSelectedAuthorIds(prev => {
      const updated = new Set(prev);
      removedAuthorIds.forEach(id => {
        const stillUsed = garden.modal_functions?.some(f =>
          f.id!== functionId &&
          selectedFunctionIds.includes(f.id) &&
          f.authors?.includes(id)
        );
        if (!stillUsed) {
          updated.delete(id);
        }
      });
      return updated;
    });
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
          modal_function_ids: selectedFunctionIds,
          authors: Array.from(selectedAuthorIds),
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

  const deploymentIdsUsedInGarden = new Set(
      garden.modal_functions?.map(f => f.modal_app_id).filter(Boolean)
    );


  const userOwnedDeployments = modelDeployments?.filter(d =>
    d.originalData?.owner_identity_id === currentUser?.identity_id && (
      d.modal_function_ids?.some(fid =>
        garden.modal_functions?.some(gf => gf.id === fid)
      ) || deploymentIdsUsedInGarden.has(d.id)
    )
  ) || [];

  const shouldShowManageDeploymentsButton = userOwnedDeployments.length > 0;

  return (
    <>
    {(garden.owner_identity_id === currentUser?.identity_id || shouldShowManageDeploymentsButton) && (
    <div className="flex gap-2 mt-2">
      {garden.owner_identity_id === currentUser?.identity_id && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add/Remove Functions
        </Button>
      )}
    
      {shouldShowManageDeploymentsButton && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsDeploymentDialogOpen(true)}
        >
          Manage Deployments
        </Button>
      )}
    </div>
  )}

      <Dialog open={isDeploymentDialogOpen} onOpenChange={setIsDeploymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deployments in This Garden</DialogTitle>
          </DialogHeader>

          <div className="mb-2 text-sm text-gray-500">
            These are the model deployments currently used in this garden. You can click to view details or open your full deployments tab.
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              onClick={() => navigate("/user?tab=model-deployments")}
            >
              View All Deployments
            </Button>
          </div>

          {userOwnedDeployments.length === 0 ? (
            <div className="text-sm text-gray-500 mt-4">No deployments you own are used in this garden.</div>
          ) : (
            <div className="relative mb-4 rounded-md border bg-white mt-4">
              <div className="max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead className="w-2/3">Deployment Name</TableHead>
                      <TableHead className="w-1/3 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userOwnedDeployments.map((deployment) => (
                      <TableRow 
                        key={deployment.id}
                        onClick={() => navigate(`/model-deployments/${deployment.id}`)}
                        className="group cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#eef5f1] border-y border-transparent hover:border-[#4FA86C]"
                      >
                        <TableCell className="text-[#1f3d2d font-semibold]">{deployment.name}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="group-hover:bg-[#4FA86C] group-hover:text-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/model-deployments/${deployment.id}`)
                            }}
                          >
                            View
                            <ExternalLink size={14} className="mb-0.5 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Manage Garden Functions</DialogTitle>
          </DialogHeader>

          <div className="mb-2"> {/* flex items-center justify-between */}
            <p className="text-sm text-gray-500">
              Select functions to include in this garden:
            </p>
          </div>

          <FunctionSelectionTable
            functions={functions}
            selectedFunctionIds={selectedFunctionIds}
            onSelectionChange={setSelectedFunctionIds}
            isLoading={isLoading}
            isFetching={isFetching}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSelectedChips
            showClearAllButton
            onFunctionAdded={handleFunctionAdded}
            onFunctionRemoved={handleFunctionRemoved}
          />

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