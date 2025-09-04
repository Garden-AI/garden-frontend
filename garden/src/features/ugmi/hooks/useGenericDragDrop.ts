import { useState, useCallback } from "react";
import { DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

export interface DragItem {
  id: string;
  type: string;
  data: unknown;
}

export interface DropTarget {
  id: string;
  type: string;
  data?: unknown;
}

export interface DragDropContext {
  draggedItems: DragItem[];
  activeDropTarget: DropTarget | null;
  isDragging: boolean;
}

export interface DropHandler {
  targetId: string;
  targetType: string;
  handler: (draggedItems: DragItem[]) => void;
}

export function useGenericDragDrop() {
  const [draggedItems, setDraggedItems] = useState<DragItem[]>([]);
  const [activeDropTarget, setActiveDropTarget] = useState<DropTarget | null>(null);
  const [dropHandlers, setDropHandlers] = useState<Map<string, DropHandler>>(new Map());

  // Configure sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 10 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  // Register a drop handler for a specific target
  const registerDropHandler = useCallback((handler: DropHandler) => {
    setDropHandlers(prev => new Map(prev.set(handler.targetId, handler)));
    return () => {
      setDropHandlers(prev => {
        const next = new Map(prev);
        next.delete(handler.targetId);
        return next;
      });
    };
  }, []);

  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    const dragItem: DragItem = {
      id: active.id,
      type: active.data.current?.type || 'unknown',
      data: active.data.current?.data,
    };
    setDraggedItems([dragItem]);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    const { over } = event;
    if (over) {
      setActiveDropTarget({
        id: over.id,
        type: over.data.current?.type || 'unknown',
        data: over.data.current,
      });
    } else {
      setActiveDropTarget(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over } = event;
    
    if (over && draggedItems.length > 0) {
      const handler = dropHandlers.get(over.id);
      if (handler) {
        handler.handler(draggedItems);
      }
    }

    // Clean up
    setDraggedItems([]);
    setActiveDropTarget(null);
  }, [draggedItems, dropHandlers]);

  const dragContext: DragDropContext = {
    draggedItems,
    activeDropTarget,
    isDragging: draggedItems.length > 0,
  };

  return {
    // Context for components
    dragContext,
    
    // DndKit props
    sensors,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    
    // Handler registration
    registerDropHandler,
  };
}