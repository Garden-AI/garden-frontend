import React, { useState, useEffect } from "react";
import { EditIcon, SaveIcon, XIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { Garden } from "@/types";
import { usePatchGarden } from "@/features/gardens/api/usePatchGarden";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { z } from "zod";
import { formSchema } from "../EditGardenschemas";

// Define fallback schemas for fields not covered in formSchema
const fallbackSchemas = {
  // Default schema for required fields
  required: z.string().min(1, { message: "This field is required" }),
  
  // Default schema for array fields
  requiredArray: z.array(z.string()).min(1, { message: "At least one value is required" })
};

export interface EditableMetadataFieldProps {
  label: string;
  value: string | string[] | undefined;
  fieldName: string;
  garden: Garden;
  ownsThisGarden: boolean;
  isRequired?: boolean;
  isArray?: boolean;
  placeholder?: string;
  onSave?: () => void;
}

const EditableMetadataField = ({
  label,
  value,
  fieldName,
  garden,
  ownsThisGarden,
  isRequired = false,
  isArray = false,
  placeholder = "Not specified",
  onSave
}: EditableMetadataFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputValue, setInputValue] = useState<string | string[]>(value || (isArray ? [] : ""));
  const { mutateAsync: updateGarden } = usePatchGarden();
  
  // Update inputValue when value prop changes
  useEffect(() => {
    setInputValue(value || (isArray ? [] : ""));
  }, [value, isArray]);
  
  // Create a displayable value for the field
  const displayValue = React.useMemo(() => {
    if (!value) {
      return <span className="italic text-gray-400">No {label.toLowerCase()} added</span>;
    }
    
    if (isArray && Array.isArray(value)) {
      return value.length > 0 
        ? value.join(", ")
        : <span className="italic text-gray-400">No {label.toLowerCase()} added</span>;
    }
    
    return value;
  }, [value, isArray, label]);
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Create a partial garden object with the updated field
      const updateData: Partial<Garden> = {};
      
      // Handle read-only properties correctly
      if (fieldName !== 'entrypoint_ids' && fieldName !== 'modal_function_ids') {
        // Only try to update non-readonly fields
        updateData[fieldName as keyof Omit<Garden, 'entrypoint_ids' | 'modal_function_ids'>] = inputValue as any;
      }
      
      await updateGarden({
        doi: garden.doi,
        garden: updateData
      });
      
      setIsEditing(false);
      setIsSaving(false);
      if (onSave) onSave();
    } catch (error: any) {
      const errorMessage = error?.message || `Error updating ${label.toLowerCase()}`;
      toast.error(`Error updating ${label.toLowerCase()}: ${errorMessage}`);
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setInputValue(value || (isArray ? [] : ""));
    setIsEditing(false);
  };

  if (!ownsThisGarden) {
    // Non-owners just see the display value
    return (
      <div className="group border border-transparent bg-white rounded-md py-1.5 px-2.5 shadow-sm">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 font-medium">
            {label}
          </p>
        </div>
        
        <div className="mt-0.5">
          {isArray ? (
            // Display array items
            <div className="flex flex-wrap gap-1 mt-1">
              {value && Array.isArray(value) && value.length > 0 ? (
                value.map((item, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 italic text-sm">No {label.toLowerCase()} added</p>
              )}
            </div>
          ) : (
            // Display single value
            <p className="font-medium text-gray-800">
              {value || <span className="text-gray-400 italic">No {label.toLowerCase()} added</span>}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div className="mt-2 space-y-2 bg-white border border-gray-200 rounded-md p-3 shadow-sm">
        {/* Label with cancel button */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <XIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
          </Button>
        </div>
        
        {/* Text input or pill input */}
        {isArray ? (
          // Handle array inputs (like authors)
          fieldName === 'authors' || fieldName === 'contributors' || fieldName === 'tags' ? (
            <MultipleSelector
              value={(Array.isArray(inputValue) ? inputValue : []).map(val => ({ value: val, label: val }))}
              onChange={(options: any) => setInputValue(options.map((opt: any) => opt.value))}
              placeholder={`Add ${fieldName}`}
              creatable
              className="w-full"
            />
          ) : (
            <Input 
              value={Array.isArray(inputValue) ? inputValue.join(", ") : ""}
              onChange={(e) => setInputValue(e.target.value.split(",").map(s => s.trim()).filter(s => s))}
              placeholder="Comma-separated values"
              className="w-full"
            />
          )
        ) : fieldName === 'description' ? (
          <Textarea 
            value={inputValue as string}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[80px]"
          />
        ) : (
          <Input 
            value={inputValue as string}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        )}
        
        {/* Save button */}
        <div className="flex justify-end">
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <span className="mr-2">Saving...</span>
                <span className="animate-spin">⌛</span>
              </>
            ) : (
              <>
                <SaveIcon className="h-3.5 w-3.5 mr-1" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div
      className="group border border-transparent hover:border-gray-200 bg-white rounded-md py-1.5 px-2.5 transition-all hover:shadow-sm"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 font-medium">
          {label}
        </p>
        {ownsThisGarden && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-green hover:text-darkgreen"
                  aria-label={`Edit ${label.toLowerCase()}`}
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit {label.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="mt-0.5">
        {isArray ? (
          // Display array items
          <div className="flex flex-wrap gap-1 mt-1">
            {value && Array.isArray(value) && value.length > 0 ? (
              value.map((item, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-gray-400 italic text-sm">No {label.toLowerCase()} added</p>
            )}
          </div>
        ) : (
          // Display single value
          <p className="font-medium text-gray-800">
            {value || <span className="text-gray-400 italic">No {label.toLowerCase()} added</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditableMetadataField;