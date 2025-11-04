import React from "react";
import { useState, useEffect } from "react";
import { EditIcon, SaveIcon, XIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { HpcEndpointInfo } from "@/types";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { HpcEndpointSelector } from "@/features/hpc-admin/components/HpcEndpointSelector";
import { useHpcEndpoints } from "@/features/hpc-admin/api/useHpcEndpoints";
import { Badge } from "@/components/shadcn/badge";

export interface EditableEndpointsFieldProps {
  label: string;
  helpText?: string;
  availableEndpoints?: HpcEndpointInfo[];
  ownsThisEntity: boolean;
  onUpdate: (updateData: { endpoint_ids: number[] }) => Promise<void>;
}

const EditableEndpointsField = ({
  label,
  helpText,
  availableEndpoints,
  ownsThisEntity,
  onUpdate,
}: EditableEndpointsFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEndpointIds, setSelectedEndpointIds] = useState<number[]>([]);
  const { data: endpoints } = useHpcEndpoints();

  // Initialize selected endpoint IDs from available endpoints
  useEffect(() => {
    if (endpoints) {
      const currentEndpointNames = availableEndpoints?.map(e => e.name) || [];
      const matchingIds = endpoints
        .filter(e => currentEndpointNames.includes(e.name))
        .map(e => e.id);
      setSelectedEndpointIds(matchingIds);
    }
  }, [availableEndpoints, endpoints]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate({ endpoint_ids: selectedEndpointIds });
      setIsEditing(false);
      setIsSaving(false);
    } catch (error: any) {
      const errorMessage = error?.message || `Error updating ${label.toLowerCase()}`;
      toast.error(`Error updating ${label.toLowerCase()}: ${errorMessage}`);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original endpoint IDs
    if (endpoints) {
      const currentEndpointNames = availableEndpoints?.map(e => e.name) || [];
      const matchingIds = endpoints
        .filter(e => currentEndpointNames.includes(e.name))
        .map(e => e.id);
      setSelectedEndpointIds(matchingIds);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="mt-2 space-y-2 bg-white border border-gray-200 rounded-md p-3 shadow-sm">
        {/* Label with cancel button */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <XIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
          </Button>
        </div>

        {/* Endpoint Selector */}
        <HpcEndpointSelector
          selectedEndpointIds={selectedEndpointIds}
          onEndpointIdsChange={setSelectedEndpointIds}
          label=""
          description=""
        />

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <span className="mr-2">Saving...</span>
                <span className="animate-spin">⌛</span>
              </>
            ) : (
              <>
                <SaveIcon className="h-3.5 w-3.5 mr-1" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div
      className="group border border-transparent hover:border-gray-200 bg-white rounded-md py-1.5 px-2.5 transition-all hover:shadow-sm"
    >
      <div className="flex justify-between">
        <div className="flex items-center space-around">
          <p className="text-sm text-gray-500 font-medium">
            {label}
          </p>
          {helpText && (
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="text-gray-500 m-1.5 h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  {helpText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {ownsThisEntity && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-green hover:text-darkgreen"
                  aria-label={`Edit ${label.toLowerCase()}`}
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit {label.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="mt-0.5">
        <div className="flex flex-wrap gap-1 mt-1">
          {availableEndpoints && availableEndpoints.length > 0 ? (
            availableEndpoints.map((endpoint, index) => (
              <Badge key={index} variant="secondary">
                {endpoint.name}
              </Badge>
            ))
          ) : (
            <p className="text-gray-400 italic text-sm">No endpoints configured</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableEndpointsField;
