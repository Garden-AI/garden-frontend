import { useState, useCallback } from "react";
import { NodeApi } from 'react-arborist';

export interface DragAndDropState {
  draggedItems: NodeApi[];
  setDraggedItems: (items: NodeApi[]) => void;
  clearDraggedItems: () => void;
  isDragging: boolean;
}

export function useDragDrop(): DragAndDropState {
  const [draggedItems, setDraggedItemsState] = useState<NodeApi[]>([]);

  const setDraggedItems = useCallback((items: NodeApi[]) => {
    setDraggedItemsState(items);
  }, []);

  const clearDraggedItems = useCallback(() => {
    setDraggedItemsState([]);
  }, []);

  return {
    draggedItems,
    setDraggedItems,
    clearDraggedItems,
    isDragging: draggedItems.length > 0,
  };
}