import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { useModalAppForm } from "../../../modal/api/useModalAppForm";

/**
 * Component for uploading and deploying a Modal app
 * The first step in the two-step process for creating a Garden from a Modal app
 */
export const UploadModalAppForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    form,
    file,
    handleFileChange,
    handleSubmit,
    modalMetadata,
    isValidating,
    isDeploying,
    isValidated
  } = useModalAppForm();

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">Upload and Deploy Modal App</h2>
      
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Upload Modal App File</label>
              <Input 
                type="file" 
                accept=".py" 
                onChange={handleFileChange} 
                disabled={isValidating || isDeploying}
              />
              <p className="text-sm text-gray-500">
                Upload a Python file containing your Modal app.
              </p>
            </div>
            
            {file && (
              <FormField
                control={form.control}
                name="file_contents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Contents</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="h-48 font-mono"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          {modalMetadata && (
            <div className="rounded-lg border bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold">Detected App Details</h3>
              <p><span className="font-medium">App Name:</span> {modalMetadata.app_name}</p>
              <p><span className="font-medium">Functions:</span> {modalMetadata.modal_function_names.join(", ")}</p>
              <p><span className="font-medium">Base Image:</span> {modalMetadata.base_image_name}</p>
              
              {modalMetadata.modal_functions && modalMetadata.modal_functions.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">Function Preview</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <SyntaxHighlighter>
                      {modalMetadata.modal_functions[0].function_text}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearchParams({})}
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              disabled={!isValidated || isDeploying}
            >
              {isDeploying ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Deploying...
                </>
              ) : (
                "Deploy Modal App & Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {isDeploying && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
          <h4 className="font-medium">Deployment in Progress</h4>
          <p className="mt-2 text-sm">
            Your Modal app is being deployed. This may take a few minutes if your app has large dependencies.
            Please do not close this page while deployment is in progress.
          </p>
        </div>
      )}
    </div>
  );
}; 