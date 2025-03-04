import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, HelpCircleIcon, InfoIcon } from "lucide-react";
import { DeploymentError } from "@/features/modal/api/useModalAppUpload";

interface DeploymentErrorAlertProps {
  error: DeploymentError;
}

export const DeploymentErrorAlert = ({ error }: DeploymentErrorAlertProps) => (
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