import { Button } from "@/components/shadcn/button";

interface FormActionsProps {
  file: File | null;
  isValidated: boolean;
  isValidating: boolean;
  isDeploying: boolean;
  toUpdate?: number;
  handleValidate: () => void;
  resetForm: () => void;
}

export const FormActions = ({ 
  file, 
  isValidated, 
  isValidating, 
  isDeploying,
  toUpdate = 0,
  handleValidate,
  resetForm,
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
      <Button 
        type="submit" 
        disabled={!isValidated || isDeploying}
      >
        {isDeploying ? "Deploying..." :  toUpdate ? "Update Modal App" : "Deploy Modal App"}
      </Button>
    </div>
  </div>
); 