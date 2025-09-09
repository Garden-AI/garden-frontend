import React from "react";
import { Form } from "@/components/shadcn/form";
import { useModalAppForm, UseModalAppFormOptions } from "@/features/modal/api/useModalAppForm";
import { ModelDeployment } from "@/features/model-deployments/ModelDeployments";
import { FileUploadSection } from "@/features/modal/components/FileUploadSection";
import { DetectedAppCard } from "@/features/modal/components/DetectedAppCard";
import { FunctionMetadataEditor } from "@/features/modal/components/FunctionMetadataEditor";
import { FormActions } from "@/features/modal/components/FormActions";
import { DeploymentLoading } from "@/features/modal/components/DeploymentLoading";
import { DeploymentNotice } from "@/features/modal/components/DeploymentNotice";
import { ValidationErrorAlert } from "@/features/modal/components/alerts/ValidationErrorAlert";
import { DeploymentErrorAlert } from "@/features/modal/components/alerts/DeploymentErrorAlert";
import { OverallProgress } from "@/components/progress/OverallProgress";
import { ProgressSteps } from "@/features/modal/components/progress/ProgressSteps";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Link } from "react-router-dom";

export interface ModalAppFormProps extends Omit<UseModalAppFormOptions, 'onDeploymentSuccess'> {
  /**
   * Whether to show the overall progress bar (used in multi-step flows like garden creation)
   * @default false 
   */
  showOverallProgress?: boolean;
  /**
   * The current phase in a multi-step flow
   * @default 1
   */
  currentPhase?: number;
  /**
   * URL for the "View My Deployments" button in success state
   * @default "/user"
   */
  viewDeploymentsUrl?: string;
  /**
   * URL to redirect to after successful deployment, with ':id' placeholder for app ID
   * Examples: 
   * - "/garden/create?modalAppId=:id" (will create a search param)
   * - "/model-deployments/:id" (will replace :id with the actual ID)
   * @default undefined - if not specified, will use the default behavior
   */
  redirectUrl?: string;
  /**
   * Function called after successful deployment
   * @param id The ID of the deployed app
   */
  onSuccess?: (id: number) => void;
  /**
   * Function called immediately when deployment starts (before completion)
   * @param id The ID of the deployment that was started
   */
  onDeploymentSuccess?: (id: number) => void;
}

export const ModalAppForm = ({
  showOverallProgress = false,
  currentPhase = 1,
  viewDeploymentsUrl = "/user",
  redirectUrl,
  onSuccess,
  onDeploymentSuccess,
  ...hookOptions
}: ModalAppFormProps) => {
  const {
    form,
    file,
    handleFileChange,
    handleFunctionMetadataChange,
    handleValidate,
    handleSubmit,
    resetForm,
    modalMetadata,
    isValidating,
    isDeploying,
    isValidated,
    isDeploymentComplete,
    deployedAppId,
    validationError,
    deploymentError
  } = useModalAppForm({
    ...hookOptions,
    redirectUrl,
    onDeploymentSuccess: (deployment: ModelDeployment) => {
      // Call the immediate callback when deployment starts (extract ID from deployment)
      onDeploymentSuccess?.(deployment.id);
      // Also call onSuccess for backward compatibility and to handle form closing
      onSuccess?.(deployment.id);
    }
  });

  // Determine the current step based on state
  const getCurrentStep = () => {
    if (isDeploymentComplete) return 5; // Deployment complete
    if (isDeploying) return 4; // Deploying stage
    if (isValidated && modalMetadata) return 3; // Edit details stage
    if (isValidating) return 2; // Validation stage
    if (file) return 2; // File uploaded, automatic validation will happen
    return 1; // Initial upload stage
  };

  const currentStep = getCurrentStep();

  return (
    <>
      {showOverallProgress && (
        <OverallProgress
          currentPhase={currentPhase}
          isCompleted={isDeploymentComplete || isDeploying || isValidated}
        />
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Upload and Deploy Modal App</h2>

        {/* Detailed Progress Steps */}
        <ProgressSteps currentStep={currentStep} />

        {isDeploymentComplete ? (
          <div className="py-12">
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 font-bold">Deployment Successful!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your Modal App has been successfully deployed and is ready to use.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center space-x-4">
              {deployedAppId && (
                <Button asChild variant="default">
                  <Link to={`/model-deployments/${deployedAppId}`}>View Deployment</Link>
                </Button>
              )}
              <Button asChild variant="secondary">
                <Link to={viewDeploymentsUrl}>View All Deployments</Link>
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Deploy Another App
              </Button>
            </div>
          </div>
        ) : isDeploying ? (
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
                toUpdate={hookOptions.toUpdate || 0}
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