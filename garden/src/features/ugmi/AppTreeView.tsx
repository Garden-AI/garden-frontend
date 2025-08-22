import React, { useState } from "react";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { ModalFunction } from "@/types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight } from "lucide-react";

type AppTreeViewProps = {
  apps: ModelDeployment[];
  onSelect?: (entity: ModelDeployment | ModalFunction) => void;
};

export const AppTreeView = ({ apps, onSelect }: AppTreeViewProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">My Apps</h2>
      </div>
      <div className="flex-1 p-2 space-y-1 overflow-y-auto">
        {apps.map((app, index) => {
          return <AppTreeNode key={index} app={app} onSelect={onSelect} />
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

  const statusColor = {
    deployed: 'text-green-600',
    undeployed: 'text-gray-500',
    error: 'text-red-600',
  }[app.status] || 'text-gray-500';

  return (
    <div ref={setNodeRef} className="select-none">
      <div 
        className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer group transition-colors duration-150"
        onClick={handleSelect}
      >
        <button
          className="flex items-center justify-center w-5 h-5 mr-2 hover:bg-gray-200 rounded transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="font-medium text-gray-900 truncate">{app.name}</div>
          <span className={`text-xs font-medium ${statusColor}`}>
            {app.status}
          </span>
        </div>
      </div>
      {isExpanded && appFunctions.length > 0 && (
        <div className="ml-7 space-y-1">
          {appFunctions.map((fn, index) => {
            return <AppFunctionTreeNode key={index} fn={fn} onSelect={onSelect} />
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
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

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
      className="flex items-center rounded-md hover:bg-purple-50 transition-colors duration-150 group"
      style={style}
    >
      {/* Drag handle */}
      <div 
        {...listeners} 
        {...attributes}
        className="w-4 h-4 mr-2 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
      </div>
      {/* Clickable content */}
      <div 
        className="flex-1 p-2 cursor-pointer"
        onClick={handleSelect}
      >
        <div className="text-sm text-gray-700 truncate">{fn.function_name || fn.title}</div>
      </div>
    </div>
  );
};