import React, { useState } from "react";
import { EditIcon, SaveIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import { toast } from "sonner";
import { Garden } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import Markdown from "@/components/Markdown";
import { usePatchGarden } from "../../api/usePatchGarden";
import { z } from "zod";
import { formSchema } from "../EditGardenschemas";
import { useGlobusAuth } from "@globus/react-auth-context";

interface GardenDescriptionProps {
  garden: Garden;
}

const GardenDescription = ({ garden }: GardenDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(garden.description || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateGarden } = usePatchGarden();
  const auth = useGlobusAuth();
  const ownsThisGarden = auth.isAuthenticated && garden.owner_identity_id === auth?.authorization?.user?.sub;
  
  const descriptionText = garden.description || "No description provided.";
  const truncateLength = 150;
  const shouldTruncate = descriptionText.length > truncateLength;
  
  const handleSave = () => {
    // Validate using the schema
    const schema = formSchema.shape.description;
    const result = schema.safeParse(inputValue);
    
    if (!result.success) {
      // Display the first validation error
      const errorMessage = result.error.errors[0]?.message || "Invalid description";
      toast.error(errorMessage);
      return;
    }
    
    updateGarden({
      doi: garden.doi,
      garden: { description: inputValue }
    });
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setInputValue(garden.description || "");
    setIsEditing(false);
  };

  if (isEditing && ownsThisGarden) {
    return (
      <div className="mt-2 space-y-2 border border-gray-200 rounded-md p-3 bg-gray-50 shadow-inner">
        <p className="text-sm font-medium text-gray-700 mb-1">Edit Description</p>
        <Textarea 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tell us about your garden"
          className="w-full min-h-[120px] bg-white"
        />
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleSave} 
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
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
    <div className="relative group rounded-lg border border-gray-200 p-4 hover:border-blue-200 bg-gradient-to-b from-white to-gray-50 shadow-sm">
      {ownsThisGarden && (
        <div className="absolute right-3 top-3 flex gap-1">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-green hover:text-darkgreen"
                  aria-label="Edit description"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-sm">Edit description</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div className="mt-1">
        {garden.description && garden.description.length > 300 ? (
          <>
            <div className={`${isExpanded ? "" : "line-clamp-3"} prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800`}>
              <Markdown content={garden.description} />
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-1" /> Show More
                </>
              )}
            </button>
          </>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800">
            <Markdown content={garden.description || ""} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenDescription; 