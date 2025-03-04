import { Form } from "@/components/ui/form";
import { useSearchParams } from "react-router-dom";
import { useModalAppForm } from "@/features/modal/api/useModalAppForm";
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