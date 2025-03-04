import { FileCode, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/form.utils";

interface FileUploadSectionProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValidating: boolean;
  isDeploying: boolean;
  isValidated: boolean;
  file: File | null;
}

export const FileUploadSection = ({ 
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