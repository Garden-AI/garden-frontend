import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { CreateHpcEndpointForm } from "./CreateHpcEndpointForm";
import { HpcEndpointResponse } from "@/types";

interface CreateHpcEndpointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (endpoint: HpcEndpointResponse) => void;
}

export const CreateHpcEndpointDialog: React.FC<CreateHpcEndpointDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const handleSuccess = (endpoint?: HpcEndpointResponse) => {
    if (endpoint) {
      onSuccess?.(endpoint);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New HPC Endpoint</DialogTitle>
          <DialogDescription>
            Add a new HPC site with its Globus Compute endpoint ID
          </DialogDescription>
        </DialogHeader>
        <CreateHpcEndpointForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
