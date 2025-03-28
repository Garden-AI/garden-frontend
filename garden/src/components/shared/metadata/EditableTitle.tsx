import { useState } from "react";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Garden, ModalFunction } from "@/types";

type Entity = Garden | ModalFunction;

export interface EditableTitleProps {
  entity: Entity;
  ownsThisEntity: boolean;
  onUpdate: (updateData: any) => Promise<void>;
}

const EditableTitle = ({ entity, ownsThisEntity, onUpdate }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(entity.title);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await onUpdate({ title: inputValue });
      toast.success("Title updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(`Error updating title: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setInputValue(entity.title);
    setIsEditing(false);
  };

  if (isEditing && ownsThisEntity) {
    return (
      <div className="flex flex-col gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-xl md:text-2xl font-medium"
          placeholder="Title"
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
      <h1 className="text-xl md:text-2xl font-medium">{entity.title}</h1>
      {ownsThisEntity && (
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