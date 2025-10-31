import React from "react";
import { X, Sprout, Library, Package } from "lucide-react";
import { 
    DndContext, 
    closestCenter, 
    PointerSensor, 
    useSensor, 
    useSensors,
    DragEndEvent,
    Modifier
} from "@dnd-kit/core";
import { 
    SortableContext, 
    useSortable, 
    horizontalListSortingStrategy,
    arrayMove 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Entity, matchEntityType } from "../types";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

interface OpenTabsBarProps {
    tabs: Array<{ entity: Entity; id: string }>;
    activeTabId: string | null;
    onTabClick: (id: string) => void;
    onTabClose: (id: string) => void;
    onReorder: (newOrder: Array<{ entity: Entity; id: string }>) => void;
}

const restrictToHorizontalAxis: Modifier = ({ transform }) => {
    return {
        ...transform,
        y: 0,
    };
};

const getEntityIcon = (entity: Entity) => {
    const type = matchEntityType(entity);
    if (type === "garden") {
        return Sprout;
    } else if (type === "modal-function" || type === "hpc-function") {
        return Library;
    } else if (type === "deployment") {
        return Package;
    }
    return Library;
};

const getEntityName = (entity: Entity): string => {
    const type = matchEntityType(entity);
    if (type === "garden") {
        return (entity as Garden).title || "Untitled Garden";
    } else if (type === "modal-function" || type === "hpc-function") {
        return (entity as ModalFunction).function_name || "Untitled Function";
    } else if (type === "deployment") {
        return (entity as ModelDeployment).name || "Untitled Deployment";
    }
    return "Unknown";
};

interface SortableTabProps {
    tab: { entity: Entity; id: string };
    isActive: boolean;
    onTabClick: (id: string) => void;
    onTabClose: (id: string) => void;
}

const SortableTab: React.FC<SortableTabProps> = ({ tab, isActive, onTabClick, onTabClose }) => {
    const [isDraggingState, setIsDraggingState] = React.useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: tab.id,
        data: {
            type: 'tab',
            tab: tab
        }
    });

    React.useEffect(() => {
        setIsDraggingState(isDragging);
    }, [isDragging]);

    const style = {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : 'none',
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    const IconComponent = getEntityIcon(tab.entity);
    const name = getEntityName(tab.entity);

    const handleClick = (e: React.MouseEvent) => {
        if (isDraggingState || (e.target as HTMLElement).closest('button')) {
            return;
        }
        onTabClick(tab.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm
                flex-shrink-0 max-w-[220px] select-none
                ${isActive
                    ? "bg-white shadow-sm border border-gray-200 text-gray-900"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }
            `}
            onClick={handleClick}
            {...attributes}
            {...listeners}
        >
            <IconComponent className="h-4 w-4 flex-shrink-0 pointer-events-none" />
            <span className="truncate flex-1 font-medium pointer-events-none">{name}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                }}
                onPointerDown={(e) => {
                    e.stopPropagation();
                }}
                className={`
                    rounded p-0.5 transition-colors flex-shrink-0 pointer-events-auto
                    ${isActive
                        ? "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        : "opacity-0 group-hover:opacity-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                    }
                `}
                aria-label="Close tab"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
};

export const OpenTabsBar: React.FC<OpenTabsBarProps> = ({
    tabs,
    activeTabId,
    onTabClick,
    onTabClose,
    onReorder,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tabs.findIndex(tab => tab.id === active.id);
            const newIndex = tabs.findIndex(tab => tab.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(tabs, oldIndex, newIndex);
                onReorder(newOrder);
            }
        }
    };

    if (tabs.length === 0) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis]}
        >
            <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent min-h-[52px]">
                <SortableContext 
                    items={tabs.map(t => t.id)} 
                    strategy={horizontalListSortingStrategy}
                >
                    {tabs.map((tab) => (
                        <SortableTab
                            key={tab.id}
                            tab={tab}
                            isActive={tab.id === activeTabId}
                            onTabClick={onTabClick}
                            onTabClose={onTabClose}
                        />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
};