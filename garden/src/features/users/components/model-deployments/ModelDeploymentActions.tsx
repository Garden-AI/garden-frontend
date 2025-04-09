
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { PlayIcon, SquareIcon, Trash2Icon } from "lucide-react";
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


import { ModelDeployment } from "../ModelDeployments";

interface ModelDeploymentActionsProps {
    selectedDeployments: ModelDeployment[];
    onDeploy: (deployments: ModelDeployment[]) => void;
    onUndeploy: (deployments: ModelDeployment[]) => void;
    onRemove: (deployments: ModelDeployment[]) => void;
}

export const ModelDeploymentActions = ({
    selectedDeployments,
    onDeploy: handleDeploy,
    onRemove: handleRemove,
    onUndeploy: handleUndeploy
}: ModelDeploymentActionsProps) => {
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    const canDeploy = selectedDeployments.some((d: ModelDeployment) => d.status === "error" || d.status === "undeployed");
    const canUndeploy = selectedDeployments.some((d: ModelDeployment) => d.status === "deployed" || d.status === "frozen");
    const canRemove = selectedDeployments.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeploy(selectedDeployments)}
                    disabled={!canDeploy}
                >
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Deploy
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUndeploy(selectedDeployments)}
                    disabled={!canUndeploy}
                >
                    <SquareIcon className="mr-2 h-4 w-4" />
                    Undeploy
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRemoveConfirm(true)}
                    disabled={!canRemove}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Remove
                </Button>
            </div>
            <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Model Deployments</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {selectedDeployments.length} model deployment{selectedDeployments.length === 1 ? '' : 's'}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleRemove(selectedDeployments)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}