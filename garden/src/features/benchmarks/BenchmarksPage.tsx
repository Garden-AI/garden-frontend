import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardContent,
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
import { useGetBenchmarks } from "./api/useGetBenchmarks";
import { Benchmark, BenchmarkTask } from "./types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { cn } from "@/utils/form.utils";

// Mock data for visualizing tables when API data isn't available
const mockBenchmarkResults = [
    {
        function_id: 1,
        date_invoked: new Date().toISOString(),
        accuracy: 0.95,
        f1_score: 0.92,
        precision: 0.93,
        recall: 0.91,
        latency_ms: 125,
        loss: 0.05,
    },
    {
        function_id: 2,
        date_invoked: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        accuracy: 0.78,
        f1_score: 0.72,
        precision: 0.75,
        recall: 0.68,
        latency_ms: 98,
        loss: 0.21,
    },
    {
        function_id: 3,
        date_invoked: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        accuracy: 0.52,
        f1_score: 0.48,
        precision: 0.51,
        recall: 0.45,
        latency_ms: 145,
        loss: 0.48,
    },
    {
        function_id: 4,
        date_invoked: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        accuracy: 0.31,
        f1_score: 0.27,
        precision: 0.30,
        recall: 0.25,
        latency_ms: 167,
        loss: 0.67,
    },
    {
        function_id: 1,
        date_invoked: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        accuracy: 0.09,
        f1_score: 0.04,
        precision: 0.06,
        recall: 0.03,
        latency_ms: 211,
        loss: 0.94,
    }
];

export const BenchmarksPage = () => {
    const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<number | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
    const [showMockData, setShowMockData] = useState(false); // Toggle for mock data

    // Get benchmark data
    const { data: benchmarkMetadata = [] } = useGetBenchmarks();
    const auth = useGlobusAuth();
    const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);

    // Get the selected benchmark data
    const selectedBenchmark = useMemo(() =>
        benchmarkMetadata.find((benchmark: Benchmark) => benchmark.id === selectedBenchmarkId),
        [benchmarkMetadata, selectedBenchmarkId]);

    // Use the first benchmark by default if none is selected
    useEffect(() => {
        if (!selectedBenchmarkId && benchmarkMetadata.length > 0) {
            setSelectedBenchmarkId(benchmarkMetadata[0].id);
        }
    }, [benchmarkMetadata, selectedBenchmarkId]);

    const handleBenchmarkSelection = (benchmarkId: number) => {
        setSelectedBenchmarkId(benchmarkId);
    };

    // Function to render benchmark results for a specific task
    const TaskResultPanel = ({ task }: { task: BenchmarkTask }) => {
        const { data, isLoading, refetch } = useGetBenchmarkResults(selectedBenchmarkId!, task.id);

        const benchmarkResults = Array.isArray(data) ? data : [];
        const hasPendingResults = benchmarkResults.some(
            (result: BenchmarkResult) => result.status === "pending"
        );

        // Set up polling for pending results
        useEffect(() => {
            let pollInterval: NodeJS.Timeout | null = null;

            if (hasPendingResults) {
                pollInterval = setInterval(() => {
                    console.log(`Polling for benchmark updates for task ${task.id}...`);
                    refetch();
                }, 3000); // Poll every 3 seconds
            }

            return () => {
                if (pollInterval) {
                    clearInterval(pollInterval);
                }
            };
        }, [hasPendingResults, refetch]);

        // Process results for display
        const processedResults = benchmarkResults
            .filter((item: BenchmarkResult) =>
                item.result && item.status === "done"
            )
            .map((item: BenchmarkResult) => ({
                function_id: item.function_id,
                date_invoked: item.date_invoked,
                ...item.result as Record<string, unknown>
            }));

        // Add mock data if no real data available and showMockData is enabled
        const displayResults = showMockData && processedResults.length === 0
            ? mockBenchmarkResults
            : processedResults;

        // Generate columns from available results
        const columns = useMemo(() => {
            return displayResults.length > 0
                ? generateColumnsFromData(displayResults)
                : [];
        }, [displayResults]);

        return (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">
                        {task.function.title || task.function.function_name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div>
                            {hasPendingResults && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
                                        <span className="text-yellow-800 text-sm">
                                            Results are being processed and will update automatically.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {displayResults.length > 0 ? (
                                <BenchmarksTable
                                    columns={columns}
                                    data={displayResults}
                                />
                            ) : (
                                <div className="text-center py-6 border rounded-md bg-gray-50">
                                    <p className="text-gray-500">No results available for this task.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="flex h-full">
            {/* Benchmarks Sidebar */}
            <div className="w-64 border-r h-full p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Benchmarks</h2>
                </div>

                <div className="overflow-y-auto flex-1">
                    {benchmarkMetadata.map((benchmark: Benchmark) => (
                        <div
                            key={benchmark.id}
                            className={cn(
                                "p-2 rounded-md cursor-pointer mb-1 transition-colors",
                                selectedBenchmarkId === benchmark.id
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                            onClick={() => handleBenchmarkSelection(benchmark.id)}
                        >
                            <div className="font-medium truncate">{benchmark.name}</div>
                            {selectedBenchmarkId === benchmark.id && (
                                <div className="text-xs mt-1 text-primary-foreground/80 truncate">
                                    {benchmark.tasks?.length || 0} tasks
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {isSuperUser && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center gap-1"
                            onClick={() => setShowBenchmarkDialog(true)}
                        >
                            <Play className="h-3 w-3" />
                            Run Benchmark
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setShowMockData(!showMockData)}
                        >
                            {showMockData ? "Hide" : "Show"} Mock Data
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                {selectedBenchmark ? (
                    <>
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">{selectedBenchmark.name}</h1>
                            <p className="text-muted-foreground mt-1">{selectedBenchmark.description || "No description available"}</p>
                        </div>

                        {selectedBenchmark.tasks && selectedBenchmark.tasks.length > 0 ? (
                            <div>
                                {selectedBenchmark.tasks.map((task) => (
                                    <TaskResultPanel key={task.id} task={task} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border rounded-md bg-gray-50">
                                <p className="text-gray-500">No benchmark tasks available for this benchmark.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-xl font-medium text-gray-500 mb-2">Select a benchmark</h2>
                            <p className="text-muted-foreground">Choose a benchmark from the sidebar to view its results</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialogs */}
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
                availableBenchmarks={benchmarkMetadata.map((benchmark: Benchmark) => ({
                    id: benchmark.id,
                    name: benchmark.name
                }))}
                initialBenchmarkId={selectedBenchmarkId || undefined}
            />
        </div>
    );
}