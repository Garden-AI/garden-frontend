import React from "react";
import { Garden, ModalFunction } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Book, BookDashed, ArchiveX } from "lucide-react";
import { ParentNodeProps, ChildNodeProps } from "./BaseTreeView";

// Garden parent node component
export const GardenParentNode: React.FC<ParentNodeProps<Garden, ModalFunction>> = ({
  item: garden,
  children: functions,
  onSelect,
  selectedItem,
  isExpanded,
  onToggleExpanded,
  themeColors,
  isDropTarget,
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(garden);
    }
  };

  // Check if this garden is selected
  const isSelected =
    selectedItem &&
    "doi" in selectedItem &&
    "modal_functions" in selectedItem &&
    selectedItem.doi === garden.doi;

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

  // Combine base styles with selected state styles and drop target state
  const containerClasses = isSelected
    ? `group flex cursor-pointer items-center rounded-lg border-2 border-emerald-400 bg-emerald-50 p-2 transition-all duration-150 shadow-md`
    : isDropTarget
    ? `group flex cursor-pointer items-center rounded-lg border-2 border-blue-400 bg-blue-100 p-2 transition-all duration-150 shadow-lg`
    : `group flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-all duration-150 hover:shadow-sm ${status.hoverBg} ${status.hoverBorder}`;

  return (
    <div className="select-none">
      <div className={containerClasses} onClick={handleSelect}>
        <button
          className="mr-2 flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
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
          <div className={`truncate text-sm font-medium ${status.textColor}`}>{garden.title}</div>
        </div>
      </div>
    </div>
  );
};

// Garden function child node component
export const GardenFunctionNode: React.FC<ChildNodeProps<Garden, ModalFunction>> = ({
  item: fn,
  parent: garden,
  onSelect,
  selectedItem,
  themeColors,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fn.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleSelect = (e: React.MouseEvent) => {
    // Don't prevent default or stop propagation to allow drag events
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
    <div 
      ref={setNodeRef} 
      className={`${containerClasses} cursor-grab active:cursor-grabbing`} 
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleSelect}
      title="Click to select, drag to add to garden"
    >
      <div className="flex-1 px-2 py-1.5">
        <div className="truncate text-xs font-medium text-gray-700">{fn.function_name}</div>
      </div>
    </div>
  );
};
