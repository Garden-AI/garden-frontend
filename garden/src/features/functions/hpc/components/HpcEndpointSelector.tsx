import React, { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/shadcn/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ChevronsUpDown, Plus, X, Trash2 } from "lucide-react";
import { CreateHpcEndpointDialog } from "./CreateHpcEndpointDialog";
import { useHpcEndpoints } from "../api/useHpcEndpoints";
import { useDeleteHpcEndpoint } from "../api/useDeleteHpcEndpoint";
import { HpcEndpointResponse } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";

interface HpcEndpointSelectorProps {
  selectedEndpointIds: number[];
  onEndpointIdsChange: (ids: number[]) => void;
  label?: string;
  description?: string;
}

export const HpcEndpointSelector: React.FC<HpcEndpointSelectorProps> = ({
  selectedEndpointIds,
  onEndpointIdsChange,
  label = "Associate with HPC Endpoints (Optional)",
  description = "Select which HPC sites can run these functions",
}) => {
  const { authorization } = useGlobusAuth();
  const currentUserId = authorization?.user?.sub;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [endpointToDelete, setEndpointToDelete] = useState<HpcEndpointResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: endpoints, isLoading: endpointsLoading } = useHpcEndpoints();
  const { mutate: deleteEndpoint } = useDeleteHpcEndpoint();

  const toggleEndpoint = (id: number) => {
    const newIds = selectedEndpointIds.includes(id)
      ? selectedEndpointIds.filter((eid) => eid !== id)
      : [...selectedEndpointIds, id];
    onEndpointIdsChange(newIds);
  };

  const removeEndpoint = (id: number) => {
    onEndpointIdsChange(selectedEndpointIds.filter((eid) => eid !== id));
  };

  const handleEndpointCreated = (endpoint: HpcEndpointResponse) => {
    onEndpointIdsChange([...selectedEndpointIds, endpoint.id]);
  };

  const handleDeleteClick = (endpoint: HpcEndpointResponse) => {
    setEndpointToDelete(endpoint);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (endpointToDelete) {
      deleteEndpoint(endpointToDelete.id, {
        onSuccess: () => {
          removeEndpoint(endpointToDelete.id);
          setDeleteDialogOpen(false);
          setEndpointToDelete(null);
        },
      });
    }
  };

  const selectedEndpoints = endpoints?.filter((ep) =>
    selectedEndpointIds.includes(ep.id)
  ) || [];

  return (
    <>
      <div className="space-y-2">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                disabled={endpointsLoading}
              >
                {endpointsLoading
                  ? "Loading endpoints..."
                  : selectedEndpoints.length > 0
                    ? `${selectedEndpoints.length} endpoint${selectedEndpoints.length > 1 ? "s" : ""} selected`
                    : "Select endpoints..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search endpoints..." />
                <CommandEmpty>
                  <div className="py-6 text-center text-sm">
                    <p className="text-muted-foreground">No endpoints yet</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      Create your first endpoint
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {endpoints?.map((endpoint) => (
                    <CommandItem
                      key={endpoint.id}
                      onSelect={() => toggleEndpoint(endpoint.id)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center flex-1">
                        <Checkbox
                          checked={selectedEndpointIds.includes(endpoint.id)}
                          className="mr-2"
                        />
                        <div>
                          <div className="font-medium">{endpoint.name}</div>
                          {endpoint.gcmu_id && (
                            <div className="text-xs text-muted-foreground">
                              {endpoint.gcmu_id.substring(0, 16)}...
                            </div>
                          )}
                        </div>
                      </div>
                      {currentUserId && endpoint.owner_identity_id === currentUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(endpoint);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setCreateDialogOpen(true)}
            disabled={endpointsLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected endpoint chips */}
        {selectedEndpoints.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEndpoints.map((endpoint) => (
              <Badge key={endpoint.id} variant="secondary" className="gap-1">
                {endpoint.name}
                <button
                  type="button"
                  onClick={() => removeEndpoint(endpoint.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Create Endpoint Dialog */}
      <CreateHpcEndpointDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleEndpointCreated}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Endpoint?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{endpointToDelete?.name}"? This action
              cannot be undone. If this endpoint is associated with any functions,
              deletion will fail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
