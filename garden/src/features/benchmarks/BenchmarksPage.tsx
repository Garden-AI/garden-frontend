import { useState, useMemo, useEffect } from "react";
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
import { Loader2, Play, RefreshCw, Menu, X } from "lucide-react";

import { BenchmarksTable } from "./benchmarks-table/BenchmarksTable";
import { useGetBenchmarkResults } from "./api/useGetBenchmarkResults";
import { BenchmarkFunctionDialog } from "./components/BenchmarkFunctionDialog";
import { BenchmarkInfo } from "./components/BenchmarkInfo";
import { TaskDescription } from "./components/TaskDescription";
import { TaskVisualization } from "./components/TaskVisualization";
import { BenchmarkResult } from "@/types";
import { useGetBenchmarks } from "./api/useGetBenchmarks";
import { Benchmark, BenchmarkTask } from "./types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import { cn } from "@/utils/form.utils";

// Mock data for visualizing tables when API data isn't available (MatBench-style)
const mockBenchmarkResults = [
    {
        function_id: 1,
        date_invoked: new Date().toISOString(),
        f1_score: 0.925,
        daf: 6.12,
        accuracy: 0.94,
        precision: 0.91,
        recall: 0.93,
        rmsd: 0.045,
        latency_ms: 125,
        thermal_conductivity_mae: 0.021,
    },
    {
        function_id: 2,
        date_invoked: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        f1_score: 0.857,
        daf: 4.85,
        accuracy: 0.88,
        precision: 0.82,
        recall: 0.89,
        rmsd: 0.067,
        latency_ms: 98,
        thermal_conductivity_mae: 0.034,
    },
    {
        function_id: 3,
        date_invoked: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        f1_score: 0.742,
        daf: 3.21,
        accuracy: 0.76,
        precision: 0.69,
        recall: 0.80,
        rmsd: 0.089,
        latency_ms: 145,
        thermal_conductivity_mae: 0.052,
    },
    {
        function_id: 4,
        date_invoked: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        f1_score: 0.623,
        daf: 2.14,
        accuracy: 0.65,
        precision: 0.58,
        recall: 0.69,
        rmsd: 0.112,
        latency_ms: 167,
        thermal_conductivity_mae: 0.078,
    },
    {
        function_id: 5,
        date_invoked: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        f1_score: 0.485,
        daf: 1.23,
        accuracy: 0.51,
        precision: 0.42,
        recall: 0.56,
        rmsd: 0.156,
        latency_ms: 211,
        thermal_conductivity_mae: 0.105,
    }
];

export const BenchmarksPage = () => {
    const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<number | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
    const [showMockData, setShowMockData] = useState(false); // Toggle for mock data
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

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
        const { data, isLoading } = useGetBenchmarkResults(selectedBenchmarkId!, task.id);

        const benchmarkResults = Array.isArray(data) ? data : [];
        const hasPendingResults = benchmarkResults.some(
            (result: BenchmarkResult) => result.status === "pending"
        );

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
        const displayResults = showMockData ? mockBenchmarkResults : processedResults;

        return (
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold">
                        {task.function.title || task.function.function_name}
                    </CardTitle>
                    {displayResults.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            {displayResults.length} model{displayResults.length !== 1 ? 's' : ''} evaluated
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {hasPendingResults && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
                                        <span className="text-yellow-800 text-sm">
                                            Results are being processed and will update automatically.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Visualizations First - Main Attraction */}
                            {displayResults.length > 0 ? (
                                <TaskVisualization
                                    data={displayResults}
                                    benchmarkName={selectedBenchmark?.name}
                                />
                            ) : (
                                <div className="text-center py-6 border rounded-md bg-gray-50">
                                    <p className="text-gray-500">No results available for this task.</p>
                                </div>
                            )}

                            {/* Task Description - Context After Engagement */}
                            {displayResults.length > 0 && (
                                <TaskDescription 
                                    taskName={task.function.function_name}
                                    functionName={task.function.title || task.function.function_name}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="flex h-full relative">
            {/* Mobile Menu Button */}
            <Button
                variant="outline"
                size="sm"
                className="lg:hidden fixed top-4 left-4 z-50 bg-background shadow-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Benchmarks Sidebar */}
            <div className={cn(
                "w-64 border-r h-full p-4 flex flex-col bg-background z-40",
                "lg:relative lg:translate-x-0 lg:block",
                "fixed inset-y-0 left-0 transform transition-transform",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
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
                            onClick={() => {
                                handleBenchmarkSelection(benchmark.id);
                                setSidebarOpen(false); // Close sidebar on mobile after selection
                            }}
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
            <div className="flex-1 p-6 overflow-y-auto lg:pl-6 pl-16">
                {selectedBenchmark ? (
                    <>
                        {/* Clean Header Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-2xl font-bold">{selectedBenchmark.name}</h1>
                                <div className="text-sm text-muted-foreground">
                                    {selectedBenchmark.tasks?.length} evaluation task{selectedBenchmark.tasks?.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>

                        {/* Main Data Tables */}
                        {selectedBenchmark.tasks && selectedBenchmark.tasks.length > 0 ? (
                            <div className="space-y-6">
                                {selectedBenchmark.tasks.map((task) => (
                                    <TaskResultPanel key={task.id} task={task} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border rounded-md bg-gray-50">
                                <p className="text-gray-500">No benchmark tasks available for this benchmark.</p>
                            </div>
                        )}

                        {/* Benchmark Information - Moved to Bottom */}
                        <div className="mt-12 pt-8 border-t">
                            <BenchmarkInfo
                                benchmarkName={selectedBenchmark.name}
                                description={selectedBenchmark.description}
                                taskCount={selectedBenchmark.tasks?.length}
                            />
                        </div>
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