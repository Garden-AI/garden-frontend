import React, { ReactNode } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

// Simple TreeView container
interface TreeViewProps {
  children: ReactNode;
  className?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({
  children,
  className = "space-y-1",
}) => {
  return <div className={className}>{children}</div>;
};

// Simple TreeNode - handles both dragging and dropping
interface TreeNodeProps {
  id: string;
  children: ReactNode;
  draggable?: boolean;
  dragData?: any;
  onDrop?: (items: any[]) => void;
  className?: string;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  id,
  children,
  draggable = false,
  dragData,
  onDrop,
  className = "",
}) => {
  // Set up draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id,
    data: dragData,
    disabled: !draggable,
  });

  // Set up droppable
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id,
    data: { onDrop },
    disabled: !onDrop,
  });

  // Combine refs
  const setNodeRef = (node: HTMLElement | null) => {
    if (draggable) setDragRef(node);
    if (onDrop) setDropRef(node);
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const nodeClassName = [
    className,
    draggable && "cursor-grab active:cursor-grabbing",
    isOver && "ring-2 ring-blue-400 bg-blue-50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={nodeClassName}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
    >
      {children}
    </div>
  );
};