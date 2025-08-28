import React from "react";
import { ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, CircleCheck, CircleDotDashed, CircleX, Loader2 } from "lucide-react";
import { ParentNodeProps, ChildNodeProps } from "./BaseTreeView";

// Deployment parent node component
export const DeploymentParentNode: React.FC<
  ParentNodeProps<ModelDeployment, ModalFunction> & { isCompact?: boolean }
> = ({
  item: deployment,
  children: functions,
  onSelect,
  selectedItem,
  isExpanded,
  onToggleExpanded,
  themeColors,
  isCompact = false,
}) => {
  const { setNodeRef } = useDroppable({ id: deployment.id.toString() });

  const handleSelect = () => {
    if (onSelect) {
      onSelect(deployment);
    }
  };

  // Check if this deployment is selected
  const isSelected =
    selectedItem &&
    "originalData" in selectedItem &&
    "status" in selectedItem &&
    selectedItem.id === deployment.id;

  // Determine deployment status and styling
  const getDeploymentStatus = () => {
    // Check if deployment is pending
    const isPending = deployment.originalData?.deploy_status === "pending";
    
    if (isPending) {
      return {
        icon: <Loader2 className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-blue-500 animate-spin`} />,
        textColor: "text-gray-900",
        hoverBg: "hover:bg-blue-50",
        hoverBorder: "hover:border-blue-200",
      };
    }

    switch (deployment.status) {
      case "deployed":
        return {
          icon: <CircleCheck className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-emerald-600`} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-emerald-50",
          hoverBorder: "hover:border-emerald-200",
        };
      case "error":
        return {
          icon: <CircleX className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-red-500`} />,
          textColor: "text-gray-900",
          hoverBg: "hover:bg-red-50",
          hoverBorder: "hover:border-red-200",
        };
      case "undeployed":
      default:
        return {
          icon: (
            <CircleDotDashed className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-amber-500`} />
          ),
          textColor: "text-gray-900",
          hoverBg: "hover:bg-amber-50",
          hoverBorder: "hover:border-amber-200",
        };
    }
  };

  const status = getDeploymentStatus();

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex cursor-pointer items-center rounded-lg border-2 border-emerald-400 bg-emerald-50 ${isCompact ? "p-1" : "p-2"} transition-all duration-150 shadow-md`
    : `group flex cursor-pointer items-center rounded-lg border border-transparent ${isCompact ? "p-1" : "p-2"} transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`;

  return (
    <div ref={setNodeRef} className="select-none">
      <div className={containerClasses} onClick={handleSelect}>
        <button
          className={`mr-2 flex ${isCompact ? "h-4 w-4" : "h-5 w-5"} items-center justify-center rounded transition-colors duration-150 hover:bg-gray-200`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
          }}
        >
          {isExpanded ? (
            <ChevronDown className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-gray-600`} />
          ) : (
            <ChevronRight className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-gray-600`} />
          )}
        </button>
        <div className="flex items-center gap-2">
          {status.icon}
          <div
            className={`truncate ${isCompact ? "text-xs" : "text-sm"} font-medium ${status.textColor}`}
          >
            {deployment.name}
          </div>
        </div>
      </div>
    </div>
  );
};

// Deployment function child node component
export const DeploymentFunctionNode: React.FC<
  ChildNodeProps<ModelDeployment, ModalFunction> & { isCompact?: boolean }
> = ({ item: fn, parent: deployment, onSelect, selectedItem, themeColors, isCompact = false }) => {
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
  const isSelected =
    selectedItem &&
    "id" in selectedItem &&
    selectedItem.id === fn.id &&
    ("function_name" in selectedItem || "title" in selectedItem);

  // Combine base styles with selected state styles
  const containerClasses = isSelected
    ? `group flex items-center rounded-md border-2 border-blue-400 bg-blue-50 transition-all duration-150 shadow-md`
    : `group flex items-center rounded-md border border-transparent transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm`;

  return (
    <div ref={setNodeRef} className={containerClasses} style={style}>
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className={`mr-2 flex ${isCompact ? "h-3 w-3" : "h-4 w-4"} cursor-grab items-center justify-center active:cursor-grabbing`}
      >
        <div
          className={`${isCompact ? "h-1.5 w-1.5" : "h-2 w-2"} rounded-full bg-blue-400 transition-colors group-hover:bg-blue-500`}
        ></div>
      </div>
      {/* Clickable content */}
      <div
        className={`flex-1 cursor-pointer ${isCompact ? "px-1 py-1" : "px-2 py-1.5"}`}
        onClick={handleSelect}
      >
        <div className="truncate text-xs font-medium text-gray-700">
          {fn.function_name || fn.title}
        </div>
      </div>
    </div>
  );
};
