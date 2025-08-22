import React, { useState } from "react";
import { Garden, ModalFunction } from "@/types";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Sprout, Book, BookDashed, ArchiveX, Plus } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { CreateGardenForm } from "../gardens/components/create/CreateGardenForm";

type GardenTreeViewProps = {
  gardens: Garden[];
  onSelect?: (entity: Garden | ModalFunction) => void;
  onGardenCreated?: (garden: Garden) => void;
};

export const GardenTreeView = ({ gardens, onSelect, onGardenCreated }: GardenTreeViewProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-emerald-300 bg-emerald-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-700" />
              <h2 className="text-lg font-semibold text-emerald-900">My Gardens</h2>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-emerald-200"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 text-emerald-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create New Garden</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {gardens.map((g, index) => {
          return <GardenTreeNode key={index} garden={g} onSelect={onSelect} />;
        })}
      </div>

      {/* Create Garden Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
          <DialogHeader>
            <DialogTitle>Create New Garden</DialogTitle>
          </DialogHeader>
          <CreateGardenForm
            onFormStateChange={() => { }}
            onSuccess={(garden) => {
              setShowCreateDialog(false);
              if (onGardenCreated) {
                onGardenCreated(garden);
              }
              if (onSelect) {
                onSelect(garden);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

type GardenTreeNodeProps = {
  garden: Garden;
  onSelect?: (entity: Garden | ModalFunction) => void;
};

export const GardenTreeNode = ({ garden, onSelect }: GardenTreeNodeProps) => {
  const { setNodeRef } = useDroppable({ id: garden.doi });
  const [isExpanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(garden);
    }
  };

  // Determine garden state and styling
  const getGardenStatus = () => {
    if (garden.is_archived) {
      return {
        icon: <ArchiveX className="h-4 w-4 text-gray-500" />,
        textColor: "text-gray-600",
        hoverBg: "hover:bg-gray-50",
        hoverBorder: "hover:border-gray-200",
      };
    } else if (garden.doi_is_draft) {
      return {
        icon: <BookDashed className="h-4 w-4 text-amber-500" />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-amber-50",
        hoverBorder: "hover:border-amber-200",
      };
    } else {
      return {
        icon: <Book className="h-4 w-4 text-emerald-600" />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-emerald-50",
        hoverBorder: "hover:border-emerald-200",
      };
    }
  };

  const status = getGardenStatus();
  return (
    <div ref={setNodeRef} className="select-none">
      <div
        className={`group flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`}
        onClick={handleSelect}
      >
        <button
          className="mr-2 flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
        <div className="flex items-center gap-2">
          {status.icon}
          <div className={`truncate font-medium ${status.textColor}`}>{garden.title}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {garden.modal_functions?.map((fn, index) => {
            return <FunctionTreeNode key={index} fn={fn} onSelect={onSelect} />;
          })}
        </div>
      )}
    </div>
  );
};

type FunctionTreeNodeProps = {
  fn: ModalFunction;
  onSelect?: (entity: Garden | ModalFunction) => void;
};

export const FunctionTreeNode = ({ fn, onSelect }: FunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fn.id });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(fn);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm"
      style={style}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="mr-2 flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <div className="h-2 w-2 rounded-full bg-blue-400 transition-colors group-hover:bg-blue-500"></div>
      </div>
      {/* Clickable content */}
      <div className="flex-1 cursor-pointer px-2 py-1.5" onClick={handleSelect}>
        <div className="truncate text-sm font-medium text-gray-700">{fn.function_name}</div>
      </div>
    </div>
  );
};
