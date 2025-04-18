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
    Trash
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CopyButton from "@/components/CopyButton";
import { useGardensUsingFunctions } from "../../api/useGardensUsingFunctions";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { Button } from "@/components/shadcn/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import  instance  from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ModelDeploymentDetailsProps {
    entity: ModalAppMetadataResponse | AsyncModalAppMetadataResponse,
}

export const ModelDeploymentDetails = ({ entity }: ModelDeploymentDetailsProps) => {
    // Fetch gardens that use functions from this deployment
    const { data: relatedGardens = [], isLoading: isLoadingGardens } = useGardensUsingFunctions(entity);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get display name (prefer original_app_name if available)
    const displayName = entity.original_app_name || entity.app_name;

    // Check if entity is AsyncModalAppMetadataResponse which has deploy status
    const isAsyncEntity = 'deploy_status' in entity;
    const deployStatus = isAsyncEntity ? (entity as AsyncModalAppMetadataResponse).deploy_status : 'done';
    const deployError = isAsyncEntity ? (entity as AsyncModalAppMetadataResponse).deploy_error : null;

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

    const handleDelete = async () => {
       try {
           await instance.delete(`/modal-apps/${entity.id}`);
           queryClient.invalidateQueries({queryKey: ['modelDeployments']});
           navigate("/user?tab=model-deployments");
           toast(`Deployment Deleted: ${entity.original_app_name || entity.app_name}`);
       } catch (error: any) {
           const errorMessage = error.response?.data?.detail 
               || error.message 
               || 'Unknown error occurred';
           toast.error(`Failed to delete deployment: ${errorMessage}`);
       }
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header with Status Section */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                    <div className="flex justify-end">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        aria-description="Delete this model deployment"
                                        onClick={handleDelete}
                                    >
                                        <Trash />
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
                        Gardens Using This Deployment
                    </CardTitle>
                    <CardDescription>
                        Gardens that utilize functions from this model deployment
                    </CardDescription>
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
                            <p className="mb-1">No gardens using this model yet</p>
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
                                <div key={name} className="p-2 border rounded-md bg-gray-50">
                                    <span className="font-medium">{name}</span>
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
        </div>
    );
}