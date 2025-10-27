import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { usePatchHpcFunction } from "../api/usePatchHpcFunction";
import { useDeleteHpcFunction } from "../api/useDeleteHpcFunction";
import { HpcFunctionPatchRequest, HpcFunctionMetadataResponse } from "@/types";

import { FunctionHeader } from "../../shared/components/FunctionHeader";
import { FunctionBody } from "../../shared/components/FunctionBody";
import { FunctionExample } from "../../shared/components/FunctionExample";
import AssociatedMaterials from "../../shared/components/AssociatedMaterials";
import { GardenFunction } from "../../shared/types/function.types";
import { Button } from "@/components/shadcn/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/shadcn/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

interface HpcFunctionContentProps {
  hpcFunction: HpcFunctionMetadataResponse;
  ownsThisFunction: boolean;
  gardenDOI?: string;
  onDeleteSuccess?: () => void;
}

export const HpcFunctionContent: React.FC<HpcFunctionContentProps> = ({
  hpcFunction,
  ownsThisFunction,
  gardenDOI,
  onDeleteSuccess,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(hpcFunction.id);
  const { mutate: deleteHpcFunction } = useDeleteHpcFunction();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const gardenFunction: GardenFunction = {
    ...hpcFunction,
    functionType: 'hpc',
  };

  const handleUpdate = useCallback(async (updateData: HpcFunctionPatchRequest) => {
    await patchHpcFunction(updateData);
  }, [patchHpcFunction]);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const performDelete = () => {
    deleteHpcFunction(hpcFunction.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['hpcFunctions'] });
        queryClient.removeQueries({ queryKey: ["hpcFunctions", hpcFunction.id] });
        toast.success("HPC function deleted successfully");
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          navigate("/");
        }
      },
      onError: (error) => {
        toast.error(`Failed to delete HPC function: ${error.message}`);
      },
    });
  };

  const generateDefaultExample = (functionName: string, gardenDOI?: string) => {
    const doiExpression = gardenDOI ? `'${gardenDOI}'` : "my_garden_doi";
    return `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(${doiExpression})

# Note: HPC function execution happens via Globus Compute.
input = ['Data Here']
future = my_garden.${functionName}.submit(input, endpoint='my-globus-compute-endpoint')
results = future.result()`;
  };

  const deleteButton = ownsThisFunction ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="border-none bg-transparent hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Function</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;

  return (
    <>
      <FunctionHeader
        functionData={hpcFunction}
        functionType="hpc"
        gardenDOI={gardenDOI}
        ownsThisFunction={ownsThisFunction}
        onUpdate={handleUpdate}
        actions={deleteButton}
      />
      <FunctionBody
        functionData={hpcFunction}
        ownsThisFunction={ownsThisFunction}
        onUpdate={handleUpdate}
      />
      <FunctionExample
        functionData={hpcFunction}
        ownsThisFunction={ownsThisFunction}
        onUpdate={handleUpdate}
        generateDefaultExample={generateDefaultExample}
        gardenDOI={gardenDOI}
      />
      <AssociatedMaterials
        resource={gardenFunction}
        ownsThisFunction={ownsThisFunction}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete HPC Function</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this HPC function? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={performDelete}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
