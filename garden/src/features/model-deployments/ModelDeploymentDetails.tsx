import React, { useState } from "react";
import { ModalAppMetadataResponse, AsyncModalAppMetadataResponse } from "@/types";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "@/components/shadcn/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import { Badge } from "@/components/shadcn/badge";
import {
    CodeIcon,
    PackageIcon,
    FunctionSquareIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    LeafIcon,
    InfoIcon,
    Trash,
    RotateCw,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CopyButton from "@/components/CopyButton";
import { useGardensUsingFunctions } from "@/features/gardens/api/useGardensUsingFunctions";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { Button } from "@/components/shadcn/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shadcn/alert-dialog";
import instance from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { ModalAppForm } from "@/features/functions/modal/components/ModalAppForm";

interface ModelDeploymentDetailsProps {
    entity: ModalAppMetadataResponse | AsyncModalAppMetadataResponse,
    redirectPath?: string,
    onAfterDelete?: () => void,
}

export const ModelDeploymentDetails = ({ entity, redirectPath = "/user?tab=model-deployments", onAfterDelete }: ModelDeploymentDetailsProps) => {
    // Fetch gardens that use functions from this deployment
    const { data: relatedGardens = [], isLoading: isLoadingGardens } = useGardensUsingFunctions(entity);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showOutput, setShowOutput] = useState(false);

    // Get display name (prefer original_app_name if available)
    const displayName = entity.original_app_name || entity.app_name;

    // Check if entity is AsyncModalAppMetadataResponse which has deploy status
    const isAsyncEntity = 'deploy_status' in entity;
    const deployStatus = isAsyncEntity ? (entity as AsyncModalAppMetadataResponse).deploy_status : 'done';
    const deployError = isAsyncEntity ? (entity as AsyncModalAppMetadataResponse).deploy_error : null;
    const deploymentOutput = isAsyncEntity ? (entity as AsyncModalAppMetadataResponse).deployment_output : null;

    // Status display helpers
    const getStatusDisplay = () => {
        switch (deployStatus) {
            case 'pending':
                return {
                    icon: <ClockIcon className="h-5 w-5 text-amber-500" />,
                    label: 'Deployment in progress...',
                    color: 'bg-amber-50 text-amber-700 border-amber-200'
                };
            case 'error':
                return {
                    icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
                    label: 'Deployment failed',
                    color: 'bg-red-50 text-red-700 border-red-200'
                };
            case 'timed_out':
                return {
                    icon: <AlertTriangleIcon className="h-5 w-5 text-red-500" />,
                    label: 'Deployment timed out',
                    color: 'bg-red-50 text-red-700 border-red-200'
                };
            case 'done':
            default:
                return {
                    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
                    label: 'Deployment successful',
                    color: 'bg-green-50 text-green-700 border-green-200'
                };
        }
    };

    const statusDisplay = getStatusDisplay();

    const performDelete = async () => {
        try {
            await instance.delete(`/modal-apps/${entity.id}`);
            queryClient.invalidateQueries({ queryKey: ['modelDeployments'] });
            entity.modal_function_ids.forEach((id) => {
                queryClient.invalidateQueries({ queryKey: ["modalFunctions", id] });
            });
            toast(`Deployment Deleted: ${entity.original_app_name || entity.app_name}`);
            if (onAfterDelete) {
                onAfterDelete();
            } else {
                navigate(redirectPath);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail
                || error.message
                || 'Unknown error occurred';
            toast.error(`Failed to delete deployment: ${errorMessage}`);
        }
    };

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const handleUpdate = () => {
        setShowUpdateDialog(true);
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header with Status Section */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                    <div className="flex items-center space-x-3">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        className="flex items-center gap-2"
                                        aria-description="Update this model deployment"
                                        onClick={handleUpdate}
                                    >
                                        <RotateCw className="h-4 w-4" />
                                        <span>Update</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Update this Deployment</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"destructive"}
                                        size={"sm"}
                                        className="flex items-center gap-2"
                                        aria-description="Delete this model deployment"
                                        onClick={handleDelete}
                                    >
                                        <Trash className="h-4 w-4" />
                                        <span>Delete</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete this Deployment</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Deployment Status Card */}
                <Card className={`w-full ${statusDisplay.color}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                            {statusDisplay.icon}
                            <div className="flex-1">
                                <h3 className="text-lg font-medium">{statusDisplay.label}</h3>

                                {/* Error Display */}
                                {deployStatus === 'error' && deployError && (
                                    <div className="mt-4">
                                        <div className="flex items-center">
                                            <InfoIcon className="h-4 w-4 mr-1 text-red-600" />
                                            <h4 className="font-medium">Error details</h4>
                                        </div>
                                        <div className="mt-2 bg-white/60 p-3 rounded border border-red-200 overflow-x-auto">
                                            <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono">
                                                {deployError}
                                            </pre>
                                        </div>

                                        {/* Deployment Output (collapsible) */}
                                        {deploymentOutput && (
                                            <div className="mt-4 bg-white/60 p-3 rounded border border-red-200">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="flex w-full items-center justify-between p-0 text-sm font-medium text-red-700"
                                                    onClick={() => setShowOutput(!showOutput)}
                                                >
                                                    <span className="flex items-center">
                                                        {showOutput ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                                                        Deployment Output
                                                    </span>
                                                </Button>
                                                {showOutput && (
                                                    <div className="mt-2">
                                                        <pre className="text-xs text-red-800 whitespace-pre-wrap font-mono overflow-auto max-h-60 p-2 bg-white/80 rounded">
                                                            {deploymentOutput}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Timeout Message */}
                                {deployStatus === 'timed_out' && (
                                    <div className="mt-4 bg-white/60 p-3 rounded border border-red-200">
                                        <p className="text-sm text-red-800">
                                            Your deployment exceeded the maximum allowed time. This usually happens when initialization
                                            takes too long or when there are resource constraints.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gardens Using This Model */}
            <Card className="shadow-md border-blue-100">
                <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                        <LeafIcon className="h-5 w-5 text-green-600 mr-2" />
                        Gardens Using These Functions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingGardens ? (
                        <div className="flex items-center justify-center p-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : relatedGardens.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedGardens.map((garden) => (
                                <div key={garden.doi} className="p-4 border rounded-md hover:bg-gray-50 transition shadow-sm">
                                    <Link to={`/garden/${encodeURIComponent(garden.doi)}`} className="text-blue-600 hover:underline font-medium">
                                        {garden.title}
                                    </Link>
                                    {garden.description && (
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{garden.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
                            <AlertTriangleIcon className="h-8 w-8 mb-3 text-amber-500" />
                            <p className="mb-1">No gardens using these functions yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Functions List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                        <FunctionSquareIcon className="h-5 w-5 text-purple-600 mr-2" />
                        Functions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {entity.modal_function_names.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {entity.modal_function_names.map((name) => (
                                <div key={name} className="p-2 border rounded-md bg-gray-50 overflow-x-auto">
                                    <span className="font-medium break-words whitespace-pre-wrap text-sm block">
                                        {name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No functions available</p>
                    )}
                </CardContent>
            </Card>

            {/* Additional Details in Accordion */}
            <Accordion type="single" collapsible className="w-full shadow-sm border rounded-md">
                <AccordionItem value="dependencies">
                    <AccordionTrigger className="px-4 py-3 font-medium">
                        <div className="flex items-center">
                            <PackageIcon className="h-5 w-5 text-gray-500 mr-2" />
                            Dependencies
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                            {/* Python Requirements */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Python Packages</h3>
                                {entity.requirements && entity.requirements.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {entity.requirements.map((req, index) => (
                                            <Badge key={index} variant="secondary" className="bg-gray-100 border border-gray-200 text-gray-800">
                                                {req}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic text-sm">None specified</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Base Image</h3>
                                <Badge variant="outline" className="bg-blue-50 border border-blue-200 text-blue-800">
                                    {entity.base_image_name}
                                </Badge>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="source-code">
                    <AccordionTrigger className="px-4 py-3 font-medium">
                        <div className="flex items-center">
                            <CodeIcon className="h-5 w-5 text-gray-500 mr-2" />
                            Source Code
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="flex justify-end mb-2">
                            <CopyButton content={entity.file_contents} />
                        </div>
                        <div className="relative">
                            <SyntaxHighlighter>
                                {entity.file_contents}
                            </SyntaxHighlighter>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Update deployment dialog */}
            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent className="w-[95%] md:w-4/5 lg:w-3/4 max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Update Model Deployment</DialogTitle>
                        <DialogDescription>Upload an updated Modal App file to update this model deployment.</DialogDescription>
                    </DialogHeader>
                    <ModalAppForm toUpdate={entity.id} onSuccess={() => setShowUpdateDialog(false)} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Deployment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this model deployment? This action cannot be undone.
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
        </div>
    );
}
