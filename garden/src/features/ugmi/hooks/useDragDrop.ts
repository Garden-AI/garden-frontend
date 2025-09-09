import { useState, useCallback } from "react";
import { DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

export function useDragDrop() {
  const [draggedItems, setDraggedItems] = useState<any[]>([]);
  const [activeDropTarget, setActiveDropTarget] = useState<string | null>(null);

  // Configure sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 10 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    setDraggedItems([active.data.current]);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    const { over } = event;
    setActiveDropTarget(over?.id || null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over && over.data.current?.onDrop && active.data.current) {
      over.data.current.onDrop([active.data.current]);
    }

    // Clean up
    setDraggedItems([]);
    setActiveDropTarget(null);
  }, []);

  return {
    sensors,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    draggedItems,
    activeDropTarget,
    isDragging: draggedItems.length > 0,
  };
}