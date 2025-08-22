import React, { useState } from "react";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { ModalFunction } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  ChevronDown,
  ChevronRight,
  Boxes,
  CircleCheck,
  CircleDotDashed,
  CircleX,
  Plus,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { ModalAppForm } from "../modal/components/ModalAppForm";

type AppTreeViewProps = {
  apps: ModelDeployment[];
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: ModelDeployment | ModalFunction | any | null;
};

export const AppTreeView = ({ apps, onSelect, selectedItem }: AppTreeViewProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const auth = useGlobusAuth();

  const handleCreateClick = async () => {
    if (!auth.isAuthenticated) {
      // Trigger login flow
      await auth.authorization?.login();
      return;
    }
    setShowCreateDialog(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-purple-300 bg-purple-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-purple-700" />
              <h2 className="text-lg font-semibold text-purple-900">My Apps</h2>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-purple-200"
                    onClick={handleCreateClick}
                  >
                    <Plus className="h-4 w-4 text-purple-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create App</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {apps.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <Boxes className="h-12 w-12 text-purple-300" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">No Apps</h3>
              <p className="text-sm text-gray-500">Create one to get started</p>
            </div>
            <Button
              onClick={handleCreateClick}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create App
            </Button>
          </div>
        ) : (
          apps.map((app, index) => {
            return <AppTreeNode key={index} app={app} onSelect={onSelect} selectedItem={selectedItem} />;
          })
        )}
      </div>

      {/* Create App Deployment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
          <DialogHeader>
            <DialogTitle>Create New Model Deployment</DialogTitle>
          </DialogHeader>
          <ModalAppForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

type AppTreeNodeProps = {
  app: ModelDeployment;
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: ModelDeployment | ModalFunction | any | null;
};

export const AppTreeNode = ({ app, onSelect, selectedItem }: AppTreeNodeProps) => {
  const { setNodeRef } = useDroppable({ id: app.id.toString() });
  const [isExpanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(app);
    }
  };

  // Check if this app is selected
  const isSelected = selectedItem &&
    "originalData" in selectedItem &&
    "status" in selectedItem &&
    selectedItem.id === app.id;

  // Get functions from the app's originalData
  const appFunctions = app.originalData?.modal_functions || [];

  // Determine app status and styling
  const getAppStatus = () => {
    switch (app.status) {
      case "deployed":
        return {
          icon: <CircleCheck className="h-4 w-4" style={{ color: "#059669" }} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-green-100",
          hoverBorder: "hover:border-green-300",
        };
      case "error":
        return {
          icon: <CircleX className="h-4 w-4" style={{ color: "#dc2626" }} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-red-100",
          hoverBorder: "hover:border-red-300",
        };
      case "undeployed":
      default:
        return {
          icon: <CircleDotDashed className="h-4 w-4" style={{ color: "#ea580c" }} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-amber-100",
          hoverBorder: "hover:border-amber-300",
        };
    }
  };

  const status = getAppStatus();

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex cursor-pointer items-center rounded-lg border-2 border-purple-400 bg-purple-50 p-2 transition-all duration-150 shadow-md`
    : `group flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`;

  return (
    <div ref={setNodeRef} className="select-none">
      <div
        className={containerClasses}
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
        <div className="flex flex-1 items-center gap-2">
          {status.icon}
          <div className={`truncate font-medium ${status.textColor}`}>{app.name}</div>
        </div>
      </div>
      {isExpanded && appFunctions.length > 0 && (
        <div className="ml-7 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {appFunctions.map((fn: any, index: number) => {
            return <AppFunctionTreeNode key={index} fn={fn} onSelect={onSelect} selectedItem={selectedItem} />;
          })}
        </div>
      )}
    </div>
  );
};

type AppFunctionTreeNodeProps = {
  fn: any; // Modal function metadata from the app
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
  selectedItem?: ModelDeployment | ModalFunction | any | null;
};

export const AppFunctionTreeNode = ({ fn, onSelect, selectedItem }: AppFunctionTreeNodeProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `app-fn-${fn.id}` });

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

  // Check if this function is selected
  // A function is selected if the selectedItem is a ModalFunction with matching id
  const isSelected = selectedItem &&
    "id" in selectedItem &&
    selectedItem.id === fn.id &&
    (("function_name" in selectedItem) || ("title" in selectedItem)); // Make sure it's a ModalFunction

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex items-center rounded-md border-2 border-purple-400 bg-purple-50 transition-all duration-150 shadow-md`
    : `group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm`;

  return (
    <div
      ref={setNodeRef}
      className={containerClasses}
      style={style}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="mr-2 flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <div className="h-2 w-2 rounded-full bg-purple-400 transition-colors group-hover:bg-purple-500"></div>
      </div>
      {/* Clickable content */}
      <div className="flex-1 cursor-pointer px-2 py-1.5" onClick={handleSelect}>
        <div className="truncate text-sm font-medium text-gray-700">
          {fn.function_name || fn.title}
        </div>
      </div>
    </div>
  );
};
