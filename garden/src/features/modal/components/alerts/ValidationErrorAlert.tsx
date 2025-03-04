import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { AlertTriangle, HelpCircleIcon } from "lucide-react";
import { ValidationError } from "@/features/modal/api/useModalAppUpload";

interface ValidationErrorAlertProps {
  error: ValidationError;
}

export const ValidationErrorAlert = ({ error }: ValidationErrorAlertProps) => (
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