import React from "react";
import { useState, useEffect } from "react";
import { EditIcon, SaveIcon, XIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { Garden, ModalFunction } from "@/types";
import { toast } from "sonner";
import Markdown from "@/components/Markdown";
import { EditableCodeField } from "@/components/EditableCodeField";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

type Entity = Garden | ModalFunction;

export interface EditableMetadataFieldProps {
  label: string;
  value: string | string[] | undefined;
  helpText?: string;
  fieldName: string;
  entity: Entity;
  ownsThisEntity: boolean;
  isRequired?: boolean;
  isArray?: boolean;
  placeholder?: string;
  onSave?: () => void;
  onUpdate: (updateData: any) => Promise<void>;
}

const EditableMetadataField = ({
  label,
  value,
  fieldName,
  entity,
  ownsThisEntity,
  isArray = false,
  placeholder = "Not specified",
  onSave,
  helpText,
  onUpdate,
}: EditableMetadataFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputValue, setInputValue] = useState<string | string[]>(value || (isArray ? [] : ""));

  // Update inputValue when value prop changes
  useEffect(() => {
    const newValue = value || (isArray ? [] : "");
    setInputValue(newValue);
  }, [value, isArray]);


  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Create a partial update object with the updated field
      const updateData: any = {};

      // Handle read-only properties correctly
      if (fieldName !== 'entrypoint_ids' && fieldName !== 'modal_function_ids') {
        // Only try to update non-readonly fields
        if (isArray) {
          // Ensure array fields are always arrays, never null/undefined
          updateData[fieldName] = Array.isArray(inputValue) ? inputValue : [];
        } else {
          updateData[fieldName] = inputValue;
        }
      }

      await onUpdate(updateData);

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
              onChange={(options: any) => {
                // Ensure inputValue is set to an empty array when all options are cleared
                const newValues = options.map((opt: any) => opt.value);
                setInputValue(Array.isArray(newValues) ? newValues : []);
              }}
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
          <EditableCodeField
            label="Markdown"
            language="markdown"
            fieldName="description"
            onSave={async (value) => { }}
            onEdit={(newValue) => { setInputValue(newValue) }}
            value={entity.description || ""}
            ownsThisEntity={ownsThisEntity}
            editing={true}
            showSaveButton={false}
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
      <div className="flex justify-between">
        <div className="flex items-center space-around">
          <p className="text-sm text-gray-500 font-medium">
            {label}
          </p>
          {helpText && (
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="text-gray-500 m-1.5 h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  {helpText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {ownsThisEntity && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-green hover:text-darkgreen"
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
        ) : fieldName === 'description' ? (
          <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800">
            <Markdown content={value as string || ""} />
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