import React from "react";
import { ResizablePanelGroup, ResizableHandle } from "@/components/shadcn/resizable";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";
import { Garden } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { LeftSidePanel } from "./components/LeftSidePanel";
import { MainContentPanel } from "./components/MainContentPanel";
import { RightSidePanel } from "./components/RightSidePanel";
import { useQueryClient } from "@tanstack/react-query";
import { useSelection } from "./hooks";
import { useDragDrop } from "./hooks/useDragDrop";
import { Entity } from "./types";

export const UnifiedManagementInterface = () => {
  const queryClient = useQueryClient();

  // Initialize hooks
  const selection = useSelection();
  const dragAndDrop = useDragDrop();

  const handleItemSelected = (entity: Entity, event?: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => {
    if (event) {
      selection.handleClick(entity, event);
    } else {
      selection.selectSingle(entity);
    }
  };

  const handleAfterDelete = () => {
    selection.clearSelection();
  };

  const handleDeploymentCreated = (deployment: ModelDeployment) => {
    // Select the new deployment
    selection.selectSingle(deployment);
  };

  return (
    <DndContext
      sensors={dragAndDrop.sensors}
      onDragStart={dragAndDrop.onDragStart}
      onDragEnd={dragAndDrop.onDragEnd}
      onDragOver={dragAndDrop.onDragOver}
    >
      <div className="scrollbar-thin scrollbar-track-transparent relative flex h-screen w-full items-center overflow-hidden bg-gray-100 p-2">
        <ResizablePanelGroup
          direction="horizontal"
          className="overflow-hidden rounded-lg shadow-sm"
        >
          <LeftSidePanel
            onItemSelected={handleItemSelected}
            selectedItem={selection.primarySelection}
            selection={selection}
            onDeploymentCreated={handleDeploymentCreated}
          />
          <ResizableHandle
            withHandle
            className="w-1 bg-slate-200 transition-colors hover:bg-slate-300"
          />
          <MainContentPanel entity={selection.primarySelection} onAfterDelete={handleAfterDelete} />
          <ResizableHandle
            withHandle
            className="w-1 bg-slate-200 transition-colors hover:bg-slate-300"
          />
          <RightSidePanel
            entity={selection.primarySelection}
            onItemSelected={handleItemSelected}
            selection={selection}
          />
        </ResizablePanelGroup>
      </div>

      {/* Floating Drop Indicator */}
      {dragAndDrop.isDragging && dragAndDrop.activeDropTarget && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>
              Drop {dragAndDrop.draggedItems.length === 1 ? "item" : `${dragAndDrop.draggedItems.length} items`} here
            </span>
          </div>
        </div>
      )}

      <DragOverlay>
        {dragAndDrop.isDragging && dragAndDrop.draggedItems.length > 0 ? (
          <div className="flex items-center rounded-md border-2 border-blue-400 bg-blue-50 px-2 py-1.5 shadow-lg">
            <div className="truncate text-xs font-medium text-gray-700">
              {dragAndDrop.draggedItems.length === 1
                ? "Dragging item"
                : `${dragAndDrop.draggedItems.length} items`
              }
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
