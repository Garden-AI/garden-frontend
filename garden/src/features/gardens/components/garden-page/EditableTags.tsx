import React, { useState } from "react";
import { EditIcon, SaveIcon, XIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Garden } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { usePatchGarden } from "../../api/usePatchGarden";

export interface EditableTagsProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const EditableTags = ({ garden, ownsThisGarden }: EditableTagsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Option[]>(
    garden.tags?.map(tag => ({ label: tag, value: tag })) || []
  );
  const { mutate: updateGarden } = usePatchGarden();

  const handleSave = () => {
    const tagValues = selectedTags.map(tag => tag.value);
    
    updateGarden({
      doi: garden.doi,
      garden: { tags: tagValues }
    });
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setSelectedTags(garden.tags?.map(tag => ({ label: tag, value: tag })) || []);
    setIsEditing(false);
  };

  if (!ownsThisGarden) {
    // Non-owners just see the display value
    return (
      <div>
        <p className="text-sm text-gray-500">Tags</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {garden.tags && garden.tags.length > 0 ? (
            garden.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white text-sm rounded-md border border-gray-200"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-gray-400 italic">No tags added</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="group border border-transparent hover:border-gray-200 rounded-md p-1.5 -mx-1.5 transition-colors">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 flex items-center">
          Tags
        </p>
        
        {!isEditing && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
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
      
      {isEditing ? (
        <div className="mt-1 space-y-2">
          <MultipleSelector
            value={selectedTags}
            onChange={(newTags) => setSelectedTags(newTags)}
            placeholder="Add tags"
            creatable
            className="w-full"
          />
          
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
        <div className="flex flex-wrap gap-1 mt-1">
          {garden.tags && garden.tags.length > 0 ? (
            garden.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white text-sm rounded-md border border-gray-200"
              >
                {tag}
              </span>
            ))
          ) : (
            <div className="flex items-center text-gray-400 italic">
              <span>No tags added</span>
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-3 w-3 mr-1" /> Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableTags; 