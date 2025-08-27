import React, { useState, useMemo } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Plus, Library } from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetUserModalFunctions } from "../../modal/api/useGetUserModalFunctions";
import { ModalAppForm } from "../../modal/components/ModalAppForm";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { DeploymentGroup } from "./DeploymentGroup";

type Entity = Garden | ModalFunction | ModelDeployment;

// Extended function type with deployment info
type FunctionWithDeployment = ModalFunction & {
  deploymentId: number;
  deploymentName: string;
  deploymentStatus: string;
};

type FunctionLibraryViewProps = {
  modelDeployments: ModelDeployment[];
  gardens: Garden[];
  onSelect?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};

export const MyFunctionLibraryView = ({
  modelDeployments,
  gardens,
  onSelect,
  selectedItem,
}: FunctionLibraryViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const auth = useGlobusAuth();
  const { data: userModalFunctions } = useGetUserModalFunctions();

  const handleCreateClick = async () => {
    if (!auth.isAuthenticated) {
      await auth.authorization?.login();
      return;
    }
    setShowCreateDialog(true);
  };

  // Get functions that are already in gardens for badge indicators
  const functionsInGardens = useMemo(() => {
    const inGardens = new Set();
    gardens.forEach((garden) => {
      garden.modal_functions?.forEach((func) => {
        inGardens.add(func.id);
      });
    });
    return inGardens;
  }, [gardens]);

  // Get the set of user's function IDs
  const userFunctionIds = useMemo(() => {
    if (!userModalFunctions) return new Set();
    return new Set(userModalFunctions.map((func) => func.id));
  }, [userModalFunctions]);

  // Group deployments with user's functions, filtered by search
  const deploymentGroups = useMemo(() => {
    const groups = new Map();

    // Filter deployments that have user's functions
    modelDeployments.forEach((deployment) => {
      const functions = (deployment.originalData?.modal_functions || [])
        .filter((func: ModalFunction) => userFunctionIds.has(func.id)) // Only show user's functions
        .map((func: ModalFunction) => ({
          ...func,
          deploymentId: deployment.id,
          deploymentName: deployment.name,
          deploymentStatus: deployment.status,
          inGarden: functionsInGardens.has(func.id),
        }));

      // Apply search filter
      const filteredFunctions = functions.filter(
        (func: FunctionWithDeployment & { inGarden: boolean }) => {
          if (!searchTerm) return true;
          const searchLower = searchTerm.toLowerCase();
          return (
            func.function_name?.toLowerCase().includes(searchLower) ||
            func.title?.toLowerCase().includes(searchLower) ||
            func.description?.toLowerCase().includes(searchLower) ||
            func.deploymentName.toLowerCase().includes(searchLower)
          );
        },
      );

      // Only include groups that have functions (after filtering)
      if (filteredFunctions.length > 0) {
        groups.set(deployment.id, {
          deployment,
          functions: filteredFunctions,
        });
      }
    });

    return Array.from(groups.values());
  }, [modelDeployments, searchTerm, functionsInGardens, userFunctionIds]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="rounded-lg border-b-2 border-blue-300 bg-blue-100">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Library className="h-4 w-4 text-blue-700" />
              <h2 className="text-sm font-semibold text-blue-900">My Function Library</h2>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:bg-blue-200"
                    onClick={handleCreateClick}
                  >
                    <Plus className="h-3 w-3 text-blue-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create New Function</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-blue-200 p-2">
        <Input
          placeholder="Search my functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-blue-200 text-xs focus:border-blue-400 focus:ring-blue-400"
        />
      </div>

      {/* Deployment Groups */}
      <div className="scrollbar-thin scrollbar-track-transparent flex-1 overflow-y-auto">
        {deploymentGroups.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 text-center">
            <Library className="h-8 w-8 text-gray-300" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">No Functions Found</h3>
              <p className="text-xs text-gray-500">
                {searchTerm
                  ? "No functions match your search"
                  : "You haven't created any functions yet"}
              </p>
            </div>
            {!searchTerm && (
              <Button onClick={handleCreateClick} className="bg-blue-600 text-xs hover:bg-blue-700">
                <Plus className="mr-1 h-3 w-3" />
                Create Function
              </Button>
            )}
          </div>
        ) : (
          deploymentGroups.map((group) => (
            <DeploymentGroup
              key={group.deployment.id}
              deployment={group.deployment}
              functions={group.functions}
              onSelect={onSelect}
              selectedItem={selectedItem}
            />
          ))
        )}
      </div>

      {/* Create Function Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
          <DialogHeader>
            <DialogTitle>Create New Function</DialogTitle>
          </DialogHeader>
          <ModalAppForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
