import React, { useState } from "react";
import { Garden } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

interface VisibilityWarningProps {
  garden: Garden;
  updateGarden: Function;
}

const VisibilityWarning = ({ garden, updateGarden }: VisibilityWarningProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleMakePublic = () => {
    setIsLoading(true);
    
    updateGarden(
      {
        doi: garden.doi,
        garden: { is_test: false }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["gardens"] });
          queryClient.invalidateQueries({ queryKey: ["search"] });
          toast.success("Garden is now public");
          setIsLoading(false);
        },
        onError: (error: any) => {
          toast.error(`Error making garden public: ${error.message}`);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">This is a Test Garden</h3>
          <p className="text-amber-700 text-sm mt-1">
            This garden won't show up in search results. Other users can still access it directly if you share the link.
          </p>
        </div>
        <button
          onClick={handleMakePublic}
          disabled={isLoading}
          className="px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <LoadingSpinner /> Making public...
            </span>
          ) : (
            "Make Garden Public"
          )}
        </button>
      </div>
    </div>
  );
};

export default VisibilityWarning; 