import React, { useState, useMemo } from "react";
import { EditIcon, SaveIcon, XIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Garden } from "@/types";
import MultipleSelector from "@/components/shadcn/multiple-select";
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

export interface EditableTagsProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const EditableTags = ({ garden, ownsThisGarden }: EditableTagsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    (garden.tags || []).map(tag => ({ value: tag, label: tag }))
  );
  const { mutate: updateGarden } = usePatchGarden();
  
  // Create options based on existing tags
  const tagOptions = useMemo(() => {
    return (garden.tags || []).map(tag => ({ value: tag, label: tag }));
  }, [garden.tags]);
  
  const handleSave = () => {
    // Extract tag values
    const tagValues = selectedTags.map(tag => tag.value);
    
    // Validate using the schema
    const schema = formSchema.shape.tags;
    const result = schema.safeParse(tagValues);
    
    if (!result.success) {
      // Display the first validation error
      const errorMessage = result.error.errors[0]?.message || "Invalid tags";
      toast.error(errorMessage);
      return;
    }
    
    updateGarden(
      {
        doi: garden.doi,
        garden: { tags: tagValues }
      },
      {
        onSuccess: () => {
          toast.success('Tags updated successfully');
          setIsEditing(false);
        },
        onError: (error: any) => {
          toast.error(`Error updating tags: ${error.message}`);
        }
      }
    );
  };
  
  const handleCancel = () => {
    setSelectedTags((garden.tags || []).map(tag => ({ value: tag, label: tag })));
    setIsEditing(false);
  };
   
  if (isEditing) {
    return (
      <div className="space-y-2 bg-white border border-gray-200 rounded-md p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Tags</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <XIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
          </Button>
        </div>
        
        <MultipleSelector
          value={selectedTags}
          onChange={(options: any) => setSelectedTags(options)}
          options={tagOptions}
          placeholder="Add tags..."
          creatable
          className="w-full"
        />
        
        <div className="flex justify-end">
          <Button 
            size="sm" 
            onClick={handleSave}
            className="h-7 text-xs bg-teal hover:bg-deepTeal"
          >
            <SaveIcon className="h-3.5 w-3.5 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }
  
  // Display mode
  return (
    <div
      className="group border border-transparent hover:border-gray-200 bg-white rounded-md py-1.5 px-2.5 transition-all hover:shadow-sm"
      style={undefined}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 font-medium">
          Tags
        </p>
        {ownsThisGarden && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-teal hover:text-deepTeal"
                  aria-label="Edit tags"
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit tags</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        {garden.tags && garden.tags.length > 0 ? (
          garden.tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">No tags added</p>
        )}
      </div>
    </div>
  );
};

export default EditableTags; 