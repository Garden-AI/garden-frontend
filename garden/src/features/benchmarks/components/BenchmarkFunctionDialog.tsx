import React, { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/shadcn/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import { Button } from "@/components/shadcn/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useBenchmarkFunction } from "../api/useBenchmarkFunction";
import { useQueryClient } from "@tanstack/react-query";
import { Benchmark } from "./BenchmarkSelector";
import { TaskSelector } from "./TaskSelector";
import { useGetGardens } from "@/features/gardens/api/useGetGardens";
import { ModalFunction } from "@/types";
import { useGetBenchmarks } from "../api/useGetBenchmarks";

interface BenchmarkFunctionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableBenchmarks: Benchmark[];
    initialBenchmarkId?: number;
    initialFunctionId?: number;
}

// Define interfaces for type safety
interface BenchmarkTask {
    id: number;
    function: {
        title?: string;
        function_name?: string;
    };
}

interface BenchmarkMetadata {
    id: number;
    tasks?: BenchmarkTask[];
}

export const BenchmarkFunctionDialog = ({
    open,
    onOpenChange,
    availableBenchmarks,
    initialBenchmarkId,
    initialFunctionId,
}: BenchmarkFunctionDialogProps) => {
    // Fetch gardens that are not in draft state
    const { data: gardens = [], isLoading: isGardensLoading } = useGetGardens({
        draft: false,
    });

    // Fetch benchmark metadata
    const { data: benchmarkMetadata = [] } = useGetBenchmarks();

    // Extract functions from the gardens and deduplicate them by ID
    const availableFunctions: { id: number; name: string }[] = React.useMemo(() => {
        const functionMap = new Map<number, { id: number; name: string }>();
        gardens.forEach((garden) => {
            if (garden.modal_functions) {
                garden.modal_functions.forEach((func: ModalFunction) => {
                    // Only add if not already in the map
                    if (!functionMap.has(func.id)) {
                        functionMap.set(func.id, {
                            id: func.id,
                            name: func.function_name || func.title, // Use function_name or fallback to title
                        });
                    }
                });
            }
        });

        return Array.from(functionMap.values());
    }, [gardens]);

    const [selectedFunction, setSelectedFunction] = useState<string>(
        initialFunctionId ? initialFunctionId.toString() : ""
    );
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>(
        initialBenchmarkId ? initialBenchmarkId.toString() : ""
    );
    const [selectedTask, setSelectedTask] = useState<string>("");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the selected benchmark data
    const selectedBenchmarkData = useMemo(() =>
        benchmarkMetadata.find((benchmark: BenchmarkMetadata) => benchmark.id === parseInt(selectedBenchmark)),
        [benchmarkMetadata, selectedBenchmark]);

    // Available tasks for the selected benchmark
    const availableTasks = useMemo(() =>
        selectedBenchmarkData?.tasks?.map((task: BenchmarkTask) => ({
            id: task.id,
            name: task.function.title || task.function.function_name || ""
        })) || [],
        [selectedBenchmarkData]);

    // Update selected task when benchmark changes
    useEffect(() => {
        if (selectedBenchmarkData?.tasks && selectedBenchmarkData.tasks.length > 0) {
            setSelectedTask(selectedBenchmarkData.tasks[0].id.toString());
        } else {
            setSelectedTask("");
        }
    }, [selectedBenchmarkData]);

    const selectedTaskId = parseInt(selectedTask) || 0;
    const selectedBenchmarkId = selectedBenchmark ? parseInt(selectedBenchmark) : 0;

    const { benchmarkFunction, isSuccess, error } = useBenchmarkFunction(
        selectedBenchmarkId,
        selectedTaskId
    );
    const queryClient = useQueryClient();

    const handleSubmit = () => {
        if (!selectedFunction || !selectedBenchmark || !selectedTask) return;

        setIsSubmitting(true);
        setHasSubmitted(true);

        benchmarkFunction({
            function_id: parseInt(selectedFunction),
        });
    };

    // Reset form when dialog closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedFunction("");
            setSelectedBenchmark("");
            setSelectedTask("");
            setHasSubmitted(false);
            setIsSubmitting(false);
        }
        onOpenChange(open);
    };

    // Reset submission state when dialog opens
    useEffect(() => {
        if (open) {
            setHasSubmitted(false);
            setIsSubmitting(false);
            if (initialBenchmarkId) {
                setSelectedBenchmark(initialBenchmarkId.toString());
                // Also set the first task for this benchmark
                const benchmark = benchmarkMetadata.find((b: BenchmarkMetadata) => b.id === initialBenchmarkId);
                if (benchmark?.tasks && benchmark.tasks.length > 0) {
                    setSelectedTask(benchmark.tasks[0].id.toString());
                }
            }
        }
    }, [open, initialBenchmarkId, benchmarkMetadata]);

    // Handle successful submission
    useEffect(() => {
        if (isSuccess && hasSubmitted) {
            // Invalidate the benchmark results query when a benchmark is successfully started
            queryClient.invalidateQueries({ queryKey: ["benchmark-results"] });
            setIsSubmitting(false);

            setTimeout(() => {
                onOpenChange(false);
                setHasSubmitted(false);
            }, 2000);
        }
    }, [isSuccess, onOpenChange, queryClient, hasSubmitted]);

    // Handle error state
    useEffect(() => {
        if (error) {
            setIsSubmitting(false);
        }
    }, [error]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Benchmark a Function</DialogTitle>
                    <DialogDescription>
                        Select a function and benchmark to evaluate its performance.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="function" className="text-right">
                            Function
                        </label>
                        <div className="col-span-3">
                            <Select
                                value={selectedFunction}
                                onValueChange={setSelectedFunction}
                            >
                                <SelectTrigger id="function" disabled={isGardensLoading}>
                                    {isGardensLoading ? (
                                        <div className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading functions...
                                        </div>
                                    ) : (
                                        <SelectValue placeholder="Select a function" />
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    {availableFunctions.map((func) => (
                                        <SelectItem key={func.id} value={func.id.toString()}>
                                            {func.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="benchmark" className="text-right">
                            Benchmark
                        </label>
                        <div className="col-span-3">
                            <Select
                                value={selectedBenchmark}
                                onValueChange={setSelectedBenchmark}
                            >
                                <SelectTrigger id="benchmark">
                                    <SelectValue placeholder="Select a benchmark" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBenchmarks.map((benchmark) => (
                                        <SelectItem
                                            key={benchmark.id}
                                            value={benchmark.id.toString()}
                                        >
                                            {benchmark.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {availableTasks.length > 0 && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="task" className="text-right">
                                Task
                            </label>
                            <div className="col-span-3">
                                <TaskSelector
                                    tasks={availableTasks}
                                    selectedTaskId={selectedTask}
                                    onSelectTask={(taskId) => setSelectedTask(String(taskId))}
                                    placeholder="Select a task"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md mt-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Error: {error.message || "Failed to start benchmark"}</span>
                    </div>
                )}

                <DialogFooter>
                    {isSuccess && hasSubmitted ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Benchmark started!</span>
                        </div>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                !selectedFunction ||
                                !selectedBenchmark ||
                                (availableTasks.length > 0 && !selectedTask) ||
                                isSubmitting ||
                                isGardensLoading
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                "Start Benchmark"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 