import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/shadcn/select";

export type Task = {
    id: number | string;
    name: string;
};

interface TaskSelectorProps {
    tasks: Task[];
    selectedTaskId: number | string;
    onSelectTask: (taskId: number | string) => void;
    className?: string;
    placeholder?: string;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
    tasks,
    selectedTaskId,
    onSelectTask,
    className,
    placeholder = "Select task"
}) => {
    const handleValueChange = (value: string) => {
        // Find the task with this ID
        const selectedTask = tasks.find(t =>
            String(t.id) === value
        );

        if (selectedTask) {
            onSelectTask(selectedTask.id);
        }
    };

    return (
        <div className={className}>
            <Select
                value={String(selectedTaskId)}
                onValueChange={handleValueChange}
                disabled={tasks.length === 0}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {tasks.map(task => (
                        <SelectItem
                            key={task.id}
                            value={String(task.id)}
                        >
                            {task.name}
                        </SelectItem>
                    ))}
                    {tasks.length === 0 && (
                        <SelectItem value="none" disabled>
                            No tasks available
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}; 