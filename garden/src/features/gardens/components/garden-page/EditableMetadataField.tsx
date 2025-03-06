import React, { useState } from "react";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { toast } from "sonner";
import { Garden, GardenPatchRequest } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { usePatchGarden } from "../../api/usePatchGarden";
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
  fieldName: keyof GardenPatchRequest;
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
  const [inputValue, setInputValue] = useState<string | string[]>(value || (isArray ? [] : ""));
  const { mutate: updateGarden } = usePatchGarden();

  const displayValue = isArray 
    ? (Array.isArray(value) && value.length > 0 ? value.join(", ") : "None added") 
    : (value || placeholder);
  
  const handleSave = () => {
    // Get the appropriate schema for validation
    let schema;
    
    if (fieldName in formSchema.shape) {
      // Use the schema from formSchema if the field exists there
      schema = formSchema.shape[fieldName as keyof typeof formSchema.shape];
    } else if (isRequired) {
      // Use fallback required schema if the field is required
      schema = isArray ? fallbackSchemas.requiredArray : fallbackSchemas.required;
    } else {
      // No validation needed for optional fields
      schema = isArray ? z.array(z.string()) : z.string().optional();
    }
    
    // Validate the input value using the schema
    const result = schema.safeParse(inputValue);
    
    if (!result.success) {
      // Display the first validation error
      const errorMessage = result.error.errors[0]?.message || `Invalid ${label}`;
      toast.error(errorMessage);
      return;
    }
    
    // Construct the patch request with only the field being updated
    const patchData: GardenPatchRequest = {
      [fieldName]: inputValue
    };
    
    updateGarden({
      doi: garden.doi,
      garden: patchData
    });
    
    setIsEditing(false);
    if (onSave) onSave();
  };
  
  const handleCancel = () => {
    setInputValue(value || (isArray ? [] : ""));
    setIsEditing(false);
  };

  if (!ownsThisGarden) {
    // Non-owners just see the display value
    return (
      <div className="group border border-transparent hover:border-gray-200 rounded-md py-0.5 px-1.5 -mx-1.5 transition-colors">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 flex items-center">
            {label}
          </p>
        </div>
        
        <div className={`font-medium ${!value || (Array.isArray(value) && value.length === 0) ? 'text-gray-400 italic' : ''}`}>
          {displayValue}
        </div>
      </div>
    );
  }
  
  return (
    <div className="group border border-transparent hover:border-gray-200 rounded-md py-0.5 px-1.5 -mx-1.5 transition-colors">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 flex items-center">
          {label} 
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </p>
        
        {!isEditing && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                  aria-label={`Edit ${label}`}
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
      
      {isEditing ? (
        <div className="mt-1 space-y-2">
          {isArray ? (
            fieldName === 'authors' || fieldName === 'contributors' ? (
              <MultipleSelector
                value={(Array.isArray(inputValue) ? inputValue : []).map(val => ({ value: val, label: val }))}
                onChange={(options) => setInputValue(options.map(opt => opt.value))}
                placeholder={`Add ${fieldName}`}
                creatable
                className="w-full"
              />
            ) : (
              <Input 
                value={Array.isArray(inputValue) ? inputValue.join(", ") : ""}
                onChange={(e) => setInputValue(e.target.value)}
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
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleSave} 
              className="flex items-center gap-1"
            >
              <SaveIcon className="h-3.5 w-3.5" /> Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <XIcon className="h-3.5 w-3.5" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className={`font-medium ${!value || (Array.isArray(value) && value.length === 0) ? 'text-gray-400 italic' : ''}`}>
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default EditableMetadataField;