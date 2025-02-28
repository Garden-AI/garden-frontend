import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { useModalAppForm } from "../../../modal/api/useModalAppForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, InfoIcon, HelpCircleIcon, FileCode, Code, CheckCircle2 } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalFileMetadataResponse } from "@/types";
import { ModalAppFormValues } from "../../../modal/api/useModalAppForm";
import { UseFormReturn } from "react-hook-form";
import { ValidationError, DeploymentError } from "../../../modal/api/useModalAppUpload";
import { cn } from "@/utils/form.utils";

// Example usage templates for Modal functions
const getExampleUsagePlaceholder = (functionName: string = "function_name") => `
# Example of how to use this function
input_data = ['data']

# Call the function
result = my_garden.${functionName}(input_data)

# Return the result
return result
`.trim();

const getExampleUsagePreview = (functionName: string = "function_name", userValue?: string) => {
  const defaultExample = getExampleUsagePlaceholder(functionName);
  
  return `
from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

${userValue || defaultExample}
  `.trim();
};

// Interface for file upload section props
interface FileUploadSectionProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValidating: boolean;
  isDeploying: boolean;
  isValidated: boolean;
  file: File | null;
}

// File upload section component
const FileUploadSection = ({ 
  handleFileChange, 
  isValidating, 
  isDeploying, 
  isValidated,
  file
}: FileUploadSectionProps) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-2">
      <label className="font-medium">Upload Modal App File</label>
      <div className="flex flex-col gap-2">
        {file ? (
          <div className="overflow-hidden rounded-md border">
            {/* File info */}
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">{file.name}</span>
                <Badge variant="outline" className="bg-white">
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
              {isValidated && !isDeploying && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Validated</span>
                </div>
              )}
            </div>
            
            {/* Change file button */}
            <div className="flex items-center justify-between border-t bg-white px-3 py-2">
              <span className="text-sm text-gray-500">
                {isValidating ? "Validating file..." : 
                  isDeploying ? "Deploying..." : "File uploaded"}
              </span>
              <label 
                className={cn(
                  "cursor-pointer rounded-md border px-3 py-1 text-sm font-medium transition-colors",
                  isValidating || isDeploying 
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400" 
                    : "border-primary bg-white text-primary hover:bg-primary/5"
                )}
              >
                Change File
                <input 
                  type="file" 
                  accept=".py" 
                  onChange={handleFileChange} 
                  disabled={isValidating || isDeploying}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
            <FileCode className="mb-2 h-10 w-10 text-gray-400" />
            <div className="mb-2 text-sm font-medium text-gray-700">
              Upload your Modal App file
            </div>
            <p className="mb-4 text-xs text-gray-500">
              Upload a Python file containing your Modal app
            </p>
            <label 
              className={cn(
                "cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors",
                isValidating || isDeploying 
                  ? "cursor-not-allowed bg-gray-100 text-gray-400" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              Browse Files
              <input 
                type="file" 
                accept=".py" 
                onChange={handleFileChange} 
                disabled={isValidating || isDeploying}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Interface for validation error props
interface ValidationErrorAlertProps {
  error: ValidationError;
}

// Validation error component
const ValidationErrorAlert = ({ error }: ValidationErrorAlertProps) => (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>{error.isApiError ? "Validation Failed" : "Validation Error"}</AlertTitle>
    <AlertDescription className="space-y-2">
      <p>{error.message}</p>
      {error.suggestedFix && (
        <div className="mt-2 rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <HelpCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Suggested Fix</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.suggestedFix}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AlertDescription>
  </Alert>
);

// Interface for deployment error props
interface DeploymentErrorAlertProps {
  error: DeploymentError;
}

// Deployment error component
const DeploymentErrorAlert = ({ error }: DeploymentErrorAlertProps) => (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>
      {error.isTimeout 
        ? "Deployment Timeout" 
        : error.isApiError 
          ? "Deployment Failed" 
          : "Deployment Error"}
    </AlertTitle>
    <AlertDescription className="space-y-2">
      <p>{error.message}</p>
      {error.suggestedFix && (
        <div className="mt-2 rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <HelpCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Suggested Fix</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.suggestedFix}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {error.isTimeout && (
        <p className="mt-2 text-sm font-medium">
          This Garden is taking a long time to deploy. If your Modal App downloads large files or 
          installs large libraries, this may be expected. The installation is still happening 
          in the background.
        </p>
      )}
    </AlertDescription>
  </Alert>
);

// Interface for detected app props
interface DetectedAppCardProps {
  metadata: ModalFileMetadataResponse;
}

// Detected app card component
const DetectedAppCard = ({ metadata }: DetectedAppCardProps) => (
  <Card className="bg-gray-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileCode className="h-5 w-5" />
        Detected App
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div><span className="font-medium">App Name:</span> {metadata.app_name}</div>
      <div><span className="font-medium">Base Image:</span> {metadata.base_image_name}</div>
      
      <div>
        <div className="mb-2 font-medium">Functions:</div>
        <ScrollArea className="max-h-[180px] pr-3">
          <div className="flex flex-wrap gap-2">
            {metadata.modal_function_names.map((name, i) => (
              <Badge key={i} variant="outline" className="bg-white py-1">
                <Code className="mr-1 h-3 w-3" />
                {name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </CardContent>
  </Card>
);

// Interface for modal function editor props
interface FunctionMetadataEditorProps {
  form: UseFormReturn<ModalAppFormValues>;
  metadata: ModalFileMetadataResponse;
  handleFunctionMetadataChange: (
    functionIndex: number, 
    field: string, 
    value: string,
    event?: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
}

// Function metadata editor component
const FunctionMetadataEditor = ({ 
  form, 
  metadata, 
  handleFunctionMetadataChange 
}: FunctionMetadataEditorProps) => (
  <div className="rounded-lg border">
    <div className="border-b bg-gray-50 p-4">
      <h3 className="text-lg font-semibold">Edit Function Details</h3>
      <p className="text-sm text-gray-600">
        Customize how your functions will appear in the Garden
        <p className="text-xs text-gray-500">(You can edit these details later)</p>
      </p>
    </div>
    <div className="p-4">
      <Accordion type="single" collapsible className="w-full">
        {metadata.modal_functions?.map((func, i) => (
          <AccordionItem key={i} value={`func-${i}`}>
            <AccordionTrigger className="px-4 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>{func.function_name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-4 pt-4">
              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Function Title" />
                    </FormControl>
                    <FormDescription>
                      A descriptive title for your function
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe what this function does..." 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what your function does and how it should be used
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.example_usage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Usage</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder={getExampleUsagePlaceholder(func.function_name)}
                        className="min-h-[150px] font-mono"
                        onChange={(e) => {
                          handleFunctionMetadataChange(i, 'example_usage', e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            handleFunctionMetadataChange(
                              i,
                              'example_usage',
                              field.value,
                              e as React.KeyboardEvent<HTMLTextAreaElement>
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide example code for using this function
                    </FormDescription>
                    <FormMessage />
                    {/* Always show preview with complete example */}
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-gray-700">Preview:</div>
                      <div className="rounded-md border bg-gray-50 p-4">
                        <SyntaxHighlighter>
                          {getExampleUsagePreview(func.function_name, field.value)}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.function_text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Code</FormLabel>
                    <div className="max-h-60 overflow-auto rounded border">
                      <SyntaxHighlighter>
                        {field.value}
                      </SyntaxHighlighter>
                    </div>
                    <FormDescription>
                      This is the original function code (read-only)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

// Interface for form actions props
interface FormActionsProps {
  file: File | null;
  isValidated: boolean;
  isValidating: boolean;
  isDeploying: boolean;
  handleValidate: () => void;
  resetForm: () => void;
}

// Interface for deployment loading props
interface DeploymentLoadingProps {
  isVisible: boolean;
}

// Centralized deployment loading component
const DeploymentLoading = ({ isVisible }: DeploymentLoadingProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="my-8 flex flex-col items-center justify-center space-y-4 text-center">
      <div className="scale-75">
        <LoadingSpinner />
      </div>
      <p className="text-base font-medium text-gray-700">
        Deploying your Modal app...
      </p>
    </div>
  );
};

// Form actions component
const FormActions = ({ 
  file, 
  isValidated, 
  isValidating, 
  isDeploying,
  handleValidate,
  resetForm
}: FormActionsProps) => (
  <div className="flex justify-between">
    <Button
      type="button"
      variant="outline"
      onClick={resetForm}
      disabled={isValidating || isDeploying}
    >
      Back
    </Button>
    
    <div className="flex gap-2">
      {/* Removed separate validate button since validation is now automatic */}
      
      <Button 
        type="submit" 
        disabled={!isValidated || isDeploying}
      >
        {/* Removed spinner from button */}
        {isDeploying ? "Deploying..." : "Deploy Modal App & Continue"}
      </Button>
    </div>
  </div>
);

// Interface for deployment notice props
interface DeploymentNoticeProps {
  isVisible: boolean;
}

// Deployment notice component
const DeploymentNotice = ({ isVisible }: DeploymentNoticeProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
      <h4 className="font-medium">Deployment in Progress</h4>
      <p className="mt-2 text-sm">
        Your Modal app is being deployed. This may take a few minutes if your app has large dependencies.
        Please do not close this page while deployment is in progress.
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-md bg-blue-100 p-2 text-xs">
        <InfoIcon className="h-4 w-4" />
        <span>The next step will be configuring your Garden's details once deployment completes.</span>
      </div>
    </div>
  );
};

// Interface for the overall progress indicator
interface OverallProgressProps {
  currentPhase: number;
  isCompleted?: boolean;
}

// Overall progress component to show the main phases of garden creation
const OverallProgress = ({ currentPhase, isCompleted = false }: OverallProgressProps) => {
  const phases = [
    { number: 1, label: "Upload Modal App" },
    { number: 2, label: "Configure Garden" }
  ];

  // Calculate progress percentage - stop just before next point until completed
  const getProgressPercentage = () => {
    if (currentPhase <= 1 && !isCompleted) return 85; // Stop just before first point completes
    if (currentPhase === 1 && isCompleted) return 100; // Phase 1 complete
    if (currentPhase >= 2) return 100; // Phase 2 or beyond
    return 0; // Shouldn't reach here
  };

  return (
    <div className="mb-6">
      <div className="mb-2">
        <h3 className="text-base font-medium text-gray-700">Publishing Progress</h3>
      </div>
      <div className="relative max-w-3xl mx-auto">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-gray-200"></div>
        
        {/* Progress Bar Fill - This shows completed steps */}
        <div 
          className="absolute left-0 top-5 h-1 rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
        
        {/* Phases - Using a max-width container with better spacing */}
        <div className="relative max-w-md mx-auto px-8">
          <div className="flex w-full justify-between">
            {phases.map((phase) => (
              <div 
                key={phase.number} 
                className="flex flex-col items-center"
              >
                <div 
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    currentPhase >= phase.number 
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {currentPhase > phase.number ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <span className="text-base font-semibold">{phase.number}</span>
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-2 text-sm font-medium",
                    currentPhase >= phase.number ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {phase.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Interface for the progress steps component
interface ProgressStepsProps {
  currentStep: number;
}

// Progress steps component to show current stage in the upload process
const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  const steps = [
    { number: 1, label: "Upload File" },
    { number: 2, label: "Validate" },
    { number: 3, label: "Edit Details" },
    { number: 4, label: "Deploy" },
  ];

  return (
    <div className="mb-8 mt-6 border-t pt-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Current Phase: Upload Modal App</h3>
      </div>
      <div className="relative max-w-4xl mx-auto">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200"></div>
        
        {/* Progress Bar Fill - This shows completed steps with primary color */}
        <div 
          className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }}
        ></div>
        
        {/* Steps */}
        <div className="relative flex justify-between px-6">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300",
                  currentStep > step.number
                    ? "border-primary bg-primary text-white" // Completed
                    : currentStep === step.number
                      ? "border-primary bg-primary text-white" // Current
                      : "border-gray-300 bg-white text-gray-400" // Upcoming
                )}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <span className="text-sm">{step.number}</span>
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-sm",
                  currentStep >= step.number ? "font-medium text-gray-900" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Component for uploading and deploying a Modal app
 * The first step in the two-step process for creating a Garden from a Modal app
 */
export const UploadModalAppForm = () => {
  const [, setSearchParams] = useSearchParams();
  
  const {
    form,
    file,
    handleFileChange,
    handleFunctionMetadataChange,
    handleValidate,
    handleSubmit,
    modalMetadata,
    isValidating,
    isDeploying,
    isValidated,
    validationError,
    deploymentError
  } = useModalAppForm();

  // Handle form reset/back button
  const resetForm = () => setSearchParams({});

  // Determine the current step based on state
  const getCurrentStep = () => {
    if (isDeploying) return 4; // Deploying stage
    if (isValidated && modalMetadata) return 3; // Edit details stage
    if (isValidating) return 2; // Validation stage
    if (file) return 2; // File uploaded, automatic validation will happen
    return 1; // Initial upload stage
  };

  const currentStep = getCurrentStep();
  // This component represents phase 1 of the overall process
  const currentPhase = 1;

  return (
    <>
      {/* Overall Progress - Moved outside the card to connect with page heading */}
      <OverallProgress 
        currentPhase={currentPhase} 
        isCompleted={isDeploying || isValidated} 
      />
      
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Upload and Deploy Modal App</h2>
        
        {/* Detailed Progress Steps for current phase */}
        <ProgressSteps currentStep={currentStep} />
        
        {isDeploying ? (
          <>
            {/* Centralized loading display during deployment */}
            <DeploymentLoading isVisible={true} />
            <DeploymentNotice isVisible={true} />
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <FileUploadSection 
                handleFileChange={handleFileChange}
                isValidating={isValidating}
                isDeploying={isDeploying}
                isValidated={isValidated}
                file={file}
              />
              
              {/* Error Displays */}
              {validationError && <ValidationErrorAlert error={validationError} />}
              {deploymentError && <DeploymentErrorAlert error={deploymentError} />}
              
              {/* Modal App Details */}
              {modalMetadata && (
                <div className="space-y-6">
                  <DetectedAppCard metadata={modalMetadata} />
                  <FunctionMetadataEditor 
                    form={form} 
                    metadata={modalMetadata} 
                    handleFunctionMetadataChange={handleFunctionMetadataChange} 
                  />
                </div>
              )}
              
              <FormActions 
                file={file}
                isValidated={isValidated}
                isValidating={isValidating}
                isDeploying={isDeploying}
                handleValidate={handleValidate}
                resetForm={resetForm}
              />
            </form>
          </Form>
        )}
      </div>
    </>
  );
}; 