import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/shadcn/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Loader2, Play, RefreshCw } from "lucide-react";

import { BenchmarksTable, generateColumnsFromData } from "./benchmarks-table/BenchmarksTable";
import { useGetBenchmarkResults } from "./api/useGetBenchmarkResults";
import { BenchmarkFunctionDialog } from "./components/BenchmarkFunctionDialog";
import { BenchmarkResult } from "@/types";
import { BenchmarkSelector } from "./components/BenchmarkSelector";
import { TaskSelector } from "./components/TaskSelector";
import { useGetBenchmarks } from "./api/useGetBenchmarks";
import { Benchmark, BenchmarkTask } from "./types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";

export const BenchmarksPage = () => {
    const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<number>(1);
    const [selectedTaskId, setSelectedTaskId] = useState<number>(1);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);

    // Get benchmark results
    const { data, isLoading, refetch } = useGetBenchmarkResults(selectedBenchmarkId, selectedTaskId);
    const { data: benchmarkMetadata = [] } = useGetBenchmarks();

    const auth = useGlobusAuth();

    const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);

    // Get the selected benchmark data
    const selectedBenchmark = useMemo(() =>
        benchmarkMetadata.find((benchmark: Benchmark) => benchmark.id === selectedBenchmarkId),
        [benchmarkMetadata, selectedBenchmarkId]);

    // Available benchmarks for selection
    const availableBenchmarks = useMemo(() => benchmarkMetadata.map((benchmark: Benchmark) => ({
        id: benchmark.id,
        name: benchmark.name
    })), [benchmarkMetadata]);

    // Available tasks for the selected benchmark
    const availableTasks = useMemo(() =>
        selectedBenchmark?.tasks?.map((task: BenchmarkTask) => ({
            id: task.id,
            name: task.function.title || task.function.function_name
        })) || [],
        [selectedBenchmark]);

    // Handle benchmark selection from the selector component
    const handleBenchmarkSelection = (benchmarkId: number | string) => {
        if (typeof benchmarkId === 'number') {
            setSelectedBenchmarkId(benchmarkId);

            // Reset task selection when benchmark changes
            const benchmark = benchmarkMetadata.find((b: Benchmark) => b.id === benchmarkId);
            if (benchmark && benchmark.tasks && benchmark.tasks.length > 0) {
                setSelectedTaskId(benchmark.tasks[0].id);
            }
        }
    };

    const handleTaskSelection = (taskId: number | string) => {
        if (typeof taskId === 'number') {
            setSelectedTaskId(taskId);
            refetch();
        }
    };

    const handleCreateNew = () => {
        setShowCreateDialog(true);
    };

    // Safely access data and check for pending results
    const benchmarkResults = Array.isArray(data) ? data : [];

    // Check if any results have pending status
    const hasPendingResults = benchmarkResults.some(
        (result: BenchmarkResult) => result.status === "pending"
    );

    // Set up polling for pending results
    useEffect(() => {
        let pollInterval: NodeJS.Timeout | null = null;

        // If we have pending results, set up polling
        if (hasPendingResults) {
            pollInterval = setInterval(() => {
                console.log('Polling for benchmark updates...');
                refetch();
            }, 3000); // Poll every 3 seconds
        }

        // Clean up on unmount or when hasPendingResults changes
        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [hasPendingResults, refetch]);

    // Process results for display, filtering out results without a result field or not done
    const processedResults = benchmarkResults
        .filter((item: BenchmarkResult) =>
            item.result && item.status === "done"
        )
        .map((item: BenchmarkResult) => ({
            // Add function_id to each result so we can fetch function metadata
            function_id: item.function_id,
            // Add date_invoked field
            date_invoked: item.date_invoked,
            // Spread the result data
            ...item.result as Record<string, unknown>
        }));

    // Generate columns from available results
    const columns = useMemo(() => {
        return processedResults.length > 0
            ? generateColumnsFromData(processedResults)
            : [];
    }, [processedResults]);

    return (
        <div className="flex flex-col m-4 gap-4 w-full lg:max-w-[80%] lg:mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Benchmarks</h1>
                    {isSuperUser && (
                        <Button
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => setShowBenchmarkDialog(true)}
                        >
                            <Play className="h-4 w-4" />
                            Benchmark a Function
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <CardTitle>{selectedBenchmark?.name || "Benchmark"}</CardTitle>
                                <CardDescription className="mt-1">
                                    {selectedBenchmark?.description || "No description available"}
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-3 items-end mt-2 md:mt-0">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Select Benchmark</span>
                                    <BenchmarkSelector
                                        benchmarks={availableBenchmarks}
                                        selectedBenchmarkId={selectedBenchmarkId}
                                        onSelectBenchmark={handleBenchmarkSelection}
                                        onCreateNew={handleCreateNew}
                                        className="w-56"
                                    />
                                </div>
                                {availableTasks.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Select Benchmark Task</span>
                                        <TaskSelector
                                            tasks={availableTasks}
                                            selectedTaskId={selectedTaskId}
                                            onSelectTask={handleTaskSelection}
                                            className="w-56"
                                            placeholder="Select task"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {
                isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div>
                        {hasPendingResults && (
                            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
                                    <span className="text-yellow-800">
                                        Some benchmark runs are still in progress. Results will update automatically when they complete.
                                    </span>
                                </div>
                            </div>
                        )}

                        {processedResults.length > 0 ? (
                            <BenchmarksTable
                                columns={columns}
                                data={processedResults}
                            />
                        ) : (
                            <div className="text-center py-8 border rounded-md bg-gray-50">
                                <p className="text-gray-500">No benchmark results available.</p>
                            </div>
                        )}
                    </div>
                )
            }

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Benchmark</DialogTitle>
                        <DialogDescription>
                            This feature is coming soon! You&apos;ll be able to define your own custom benchmarks
                            and run your functions against them.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 text-center">
                        <div className="text-3xl mb-2">🚧</div>
                        <p className="text-gray-600">
                            We&apos;re building support for custom benchmarks that will allow you to:
                        </p>
                        <ul className="text-left mt-4 space-y-2 text-gray-600 list-disc pl-6">
                            <li>Define your own benchmark datasets and metrics</li>
                            <li>Compare performance of different functions</li>
                            <li>Compare results from different benchmarks</li>
                            <li>Share benchmark results</li>
                        </ul>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={() => setShowCreateDialog(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <BenchmarkFunctionDialog
                open={showBenchmarkDialog}
                onOpenChange={setShowBenchmarkDialog}
                availableBenchmarks={availableBenchmarks}
                initialBenchmarkId={selectedBenchmarkId}
            />
        </div>
    );
}