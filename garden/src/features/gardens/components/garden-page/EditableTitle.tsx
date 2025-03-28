import React, { useState } from "react";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { toast } from "sonner";
import { Garden } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { usePatchGarden } from "../../api/usePatchGarden";
import { z } from "zod";
import { formSchema } from "../EditGardenschemas";

export interface EditableTitleProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const EditableTitle = ({ garden, ownsThisGarden }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(garden.title);
  const { mutate: updateGarden } = usePatchGarden();

  const handleSave = () => {
    // Validate using the schema
    const schema = formSchema.shape.title;
    const result = schema.safeParse(inputValue);
    
    if (!result.success) {
      // Display the first validation error
      const errorMessage = result.error.errors[0]?.message || "Invalid title";
      toast.error(errorMessage);
      return;
    }
    
    updateGarden({
      doi: garden.doi,
      garden: { title: inputValue }
    });
    
    setIsEditing(false);
    toast.success("Title updated");
  };
  
  const handleCancel = () => {
    setInputValue(garden.title);
    setIsEditing(false);
  };

  if (isEditing && ownsThisGarden) {
    return (
      <div className="flex flex-col gap-2">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-2xl font-bold w-full"
          placeholder="Garden Title"
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
    );
  }
  
  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-2xl font-bold">{garden.title}</h1>
      {ownsThisGarden && (
        <div className="flex items-center gap-1 h-8">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-green hover:text-darkgreen"
                  aria-label="Edit title"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit title</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default EditableTitle; 