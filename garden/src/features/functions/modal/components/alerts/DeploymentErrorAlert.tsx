import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { AlertTriangle, ChevronDown, ChevronRight, HelpCircleIcon } from "lucide-react";
import { DeploymentError } from "@/features/functions/modal/api/useModalAppUpload";
import { Button } from "@/components/shadcn/button";

interface DeploymentErrorAlertProps {
  error: DeploymentError;
}

export const DeploymentErrorAlert = ({ error }: DeploymentErrorAlertProps) => {
  const [showOutput, setShowOutput] = useState(false);

  return (
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
        {error.deploymentOutput && (
          <div className="mt-2 rounded-md bg-gray-50 p-3">
            <Button
              type="button"
              variant="ghost"
              className="flex w-full items-center justify-between p-0 text-sm font-medium text-gray-700"
              onClick={() => setShowOutput(!showOutput)}
            >
              <span className="flex items-center">
                {showOutput ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                Deployment Output
              </span>
            </Button>
            {showOutput && (
              <div className="mt-2">
                <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60 p-2 bg-gray-100 rounded">
                  {error.deploymentOutput}
                </pre>
              </div>
            )}
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
  )
}; 