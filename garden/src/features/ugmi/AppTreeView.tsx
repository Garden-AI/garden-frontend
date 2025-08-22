import React, { useState } from "react";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { ModalFunction } from "@/types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Boxes } from "lucide-react";

type AppTreeViewProps = {
  apps: ModelDeployment[];
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
};

export const AppTreeView = ({ apps, onSelect }: AppTreeViewProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-purple-300 bg-purple-100">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-purple-700" />
            <h2 className="text-lg font-semibold text-purple-900">My Apps</h2>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {apps.map((app, index) => {
          return <AppTreeNode key={index} app={app} onSelect={onSelect} />;
        })}
      </div>
    </div>
  );
};

type AppTreeNodeProps = {
  app: ModelDeployment;
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
};

export const AppTreeNode = ({ app, onSelect }: AppTreeNodeProps) => {
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

  // Get functions from the app's originalData
  const appFunctions = app.originalData?.modal_functions || [];

  const statusColor =
    {
      deployed: "text-green-600",
      undeployed: "text-gray-500",
      error: "text-red-600",
    }[app.status] || "text-gray-500";

  return (
    <div ref={setNodeRef} className="select-none">
      <div
        className="group flex cursor-pointer items-center rounded-md p-2 transition-colors duration-150 hover:bg-gray-50"
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
          <div className="truncate font-medium text-gray-900">{app.name}</div>
          <span className={`text-xs font-medium ${statusColor}`}>{app.status}</span>
        </div>
      </div>
      {isExpanded && appFunctions.length > 0 && (
        <div className="ml-7 space-y-1">
          {appFunctions.map((fn: any, index: number) => {
            return <AppFunctionTreeNode key={index} fn={fn} onSelect={onSelect} />;
          })}
        </div>
      )}
    </div>
  );
};

type AppFunctionTreeNodeProps = {
  fn: any; // Modal function metadata from the app
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
};

export const AppFunctionTreeNode = ({ fn, onSelect }: AppFunctionTreeNodeProps) => {
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

  return (
    <div
      ref={setNodeRef}
      className="group flex items-center rounded-md transition-colors duration-150 hover:bg-purple-50"
      style={style}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="mr-2 flex h-4 w-4 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <div className="h-2 w-2 rounded-full bg-purple-400"></div>
      </div>
      {/* Clickable content */}
      <div className="flex-1 cursor-pointer p-2" onClick={handleSelect}>
        <div className="truncate text-sm text-gray-700">{fn.function_name || fn.title}</div>
      </div>
    </div>
  );
};
