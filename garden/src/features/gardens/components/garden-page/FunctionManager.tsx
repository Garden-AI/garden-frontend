import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Garden, Function, ModalFunction, HpcFunctionMetadataResponse } from '@/types';
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
import { useGetAllModalFunctions } from '@/features/functions/modal/api/useGetAllModalFunctions';
import { usePatchGarden } from '@/features/gardens/api/usePatchGarden';
import { Link, useNavigate } from 'react-router-dom';
import { useGetModelDeployments } from '@/features/model-deployments/api/useGetModelDeployments';
import { useGetUserInfo } from '@/features/users/api/useGetUserInfo';
import FunctionSelectionTable from '@/components/FunctionSelectionTable';
import { useHpcFunctions } from '@/features/hpc-admin/api/useHpcFunctions';

interface FunctionManagerProps {
  garden: Garden;
  onSuccess?: () => void;
}

const FunctionManager: React.FC<FunctionManagerProps> = ({
  garden,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetUserInfo();

  const [selectedModalIds, setSelectedModalIds] = useState<number[]>([]);
  const [selectedHpcIds, setSelectedHpcIds] = useState<number[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeploymentDialogOpen, setIsDeploymentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: modalFunctions, isLoading: isLoadingModal, isError: isErrorModal } = useGetAllModalFunctions();
  const { data: hpcFunctions, isLoading: isLoadingHpc, isError: isErrorHpc } = useHpcFunctions();

  useEffect(() => {
    if (isErrorModal) {
      toast.error("Failed to load Modal functions.");
    }
    if (isErrorHpc) {
      toast.error("Failed to load HPC functions.");
    }
  }, [isErrorModal, isErrorHpc]);

  const allFunctions = useMemo<Function[]>(() => {
    const modals: Function[] = (modalFunctions ?? []).map(f => ({ ...f, functionType: 'modal' }));
    const hpcs: Function[] = (hpcFunctions ?? []).map(f => ({ ...f, functionType: 'hpc' }));
    return [...modals, ...hpcs];
  }, [modalFunctions, hpcFunctions]);

  // Helper to create composite keys for selection
  const toCompositeKey = (type: 'modal' | 'hpc', id: number): string => `${type}-${id}`;
  const fromCompositeKey = (key: string): { type: 'modal' | 'hpc', id: number } | null => {
    const match = key.match(/^(modal|hpc)-(\d+)$/);
    if (!match) return null;
    return { type: match[1] as 'modal' | 'hpc', id: parseInt(match[2], 10) };
  };

  useEffect(() => {
    if (isDialogOpen) {
      const initialModalIds = garden.modal_functions?.map(f => f.id) || [];
      const initialHpcIds = garden.hpc_functions?.map(f => f.id) || [];
      setSelectedModalIds(initialModalIds);
      setSelectedHpcIds(initialHpcIds);

      const initialAuthorIds = new Set<string>();
      garden.modal_functions?.forEach(fn => fn.authors?.forEach(authorName => initialAuthorIds.add(authorName)));
      garden.hpc_functions?.forEach(fn => fn.authors?.forEach(authorName => initialAuthorIds.add(authorName)));
      setSelectedAuthors(initialAuthorIds);
    }
  }, [isDialogOpen, garden]);

  const { mutateAsync: patchGarden } = usePatchGarden();

  const { data: modelDeployments } = useGetModelDeployments();

  const handleSelectionChange = (newSelectedIds: (string | number)[]) => {
    const newModalIds: number[] = [];
    const newHpcIds: number[] = [];
    const newAuthors = new Set<string>();

    newSelectedIds.forEach(id => {
      const compositeKey = typeof id === 'string' ? id : String(id);
      const parsed = fromCompositeKey(compositeKey);
      if (parsed) {
        const func = allFunctions.find(f => f.functionType === parsed.type && f.id === parsed.id);
        if (func) {
          if (func.functionType === 'modal') {
            newModalIds.push(func.id as number);
          } else {
            newHpcIds.push(func.id as number);
          }
          func.authors?.forEach(authorName => newAuthors.add(authorName));
        }
      }
    });

    setSelectedModalIds(newModalIds);
    setSelectedHpcIds(newHpcIds);
    setSelectedAuthors(newAuthors);
  };

  const handleSave = async () => {
    try {
      const initialModalIds = garden.modal_functions?.map(f => f.id) || [];
      const initialHpcIds = garden.hpc_functions?.map(f => f.id) || [];

      const modalChanged = JSON.stringify(initialModalIds.sort()) !== JSON.stringify(selectedModalIds.sort());
      const hpcChanged = JSON.stringify(initialHpcIds.sort()) !== JSON.stringify(selectedHpcIds.sort());

      if (!modalChanged && !hpcChanged) {
        toast.info("No changes to save.");
        setIsDialogOpen(false);
        return;
      }

      const addedModalCount = selectedModalIds.filter(id => !initialModalIds.includes(id)).length;
      const removedModalCount = initialModalIds.filter(id => !selectedModalIds.includes(id)).length;
      const addedHpcCount = selectedHpcIds.filter(id => !initialHpcIds.includes(id)).length;
      const removedHpcCount = initialHpcIds.filter(id => !selectedHpcIds.includes(id)).length;

      let parts: string[] = [];
      if (addedModalCount > 0) parts.push(`Added ${addedModalCount} modal function(s)`);
      if (removedModalCount > 0) parts.push(`Removed ${removedModalCount} modal function(s)`);
      if (addedHpcCount > 0) parts.push(`Added ${addedHpcCount} HPC function(s)`);
      if (removedHpcCount > 0) parts.push(`Removed ${removedHpcCount} HPC function(s)`);
      const successMessage = parts.length > 0 ? parts.join(', ') : "Garden functions updated.";

      await patchGarden({
        doi: garden.doi,
        garden: {
          ...(modalChanged && { modal_function_ids: selectedModalIds }),
          ...(hpcChanged && { hpc_function_ids: selectedHpcIds }),
          authors: Array.from(selectedAuthors),
        },
        successMessage
      });

      setIsDialogOpen(false);
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

          <div className="mb-2"> 
            <p className="text-sm text-gray-500">
              Select functions to include in this garden:
            </p>
          </div>

          <FunctionSelectionTable
            functions={allFunctions}
            selectedFunctionIds={[
              ...selectedModalIds.map(id => toCompositeKey('modal', id)),
              ...selectedHpcIds.map(id => toCompositeKey('hpc', id))
            ]}
            onSelectionChange={handleSelectionChange}
            isLoading={isLoadingModal || isLoadingHpc}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSelectedChips
            showClearAllButton
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

export default FunctionManager;