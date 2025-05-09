import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/shadcn/select";
import {
    Card,
    CardContent,
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
import { Loader2, Plus, Play, RefreshCw } from "lucide-react";

import { BenchmarksTable, generateColumnsFromData } from "./benchmarks-table/BenchmarksTable";
import { useGetBenchmarkResults } from "./api/useGetBenchmarkResults";
import { BenchmarkFunctionDialog } from "./components/BenchmarkFunctionDialog";
import { BenchmarkResult } from "@/types";

// Predefined benchmark types - only Matbench for now, structure for future expansion
const BENCHMARK_TYPES = [
    { id: "hello_benchmarks", label: "Hello Benchmarks" },
    { id: "matbench_discovery", label: "Matbench Discovery" }
];

// Create benchmark option identifier
const CREATE_NEW_BENCHMARK = "create_new";

// Benchmark descriptions and additional info
const BENCHMARK_INFO = {
    matbench_discovery: {
        title: "Matbench Discovery",
        description: "Matbench Discovery evaluates ML models for materials discovery tasks including structure relaxation and thermal property prediction.",
        metrics: ["RMSD", "Ksrme", "R²", "MAE", "Precision", "DAF", "F1", "Accuracy", "CPS"],
        referenceUrl: "https://matbench-discovery.materialsproject.org/"
    }
};

export const BenchmarksPage = () => {
    const [selectedBenchmark, setSelectedBenchmark] = useState(4);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
    const { data, isLoading, isFetching } = useGetBenchmarkResults(selectedBenchmark);

    const benchmarkInfo = BENCHMARK_INFO["matbench_discovery"];

    // Mock data for available benchmarks
    const availableBenchmarks = [
        { id: 1, name: "Matbench Discovery" },
        { id: 4, name: "Hello Benchmarks" },
    ];

    const handleBenchmarkSelection = (value: string) => {
        if (value === CREATE_NEW_BENCHMARK) {
            setShowCreateDialog(true);
            // Keep the previous selection active in the dropdown
            return;
        }
        // Parse the value to a number before using it as an index
        const index = parseInt(value);
        if (!isNaN(index) && availableBenchmarks[index]) {
            setSelectedBenchmark(availableBenchmarks[index].id);
        }
    };

    // Safely access data and check for pending results
    const benchmarkResults = Array.isArray(data) ? data : [];

    // Check if any results have pending status
    const hasPendingResults = benchmarkResults.some(
        (result: BenchmarkResult) => result.status === "pending"
    );

    // Process results for display, filtering out results without a result field or not done
    const processedResults = benchmarkResults
        .filter((item: BenchmarkResult) =>
            item.result && item.status === "done"
        )
        .map((item: BenchmarkResult) => ({
            // Add function_id to each result so we can fetch function metadata
            function_id: item.function_id,
            // Spread the result data
            ...item.result as Record<string, unknown>
        }));

    // Generate columns from available results
    const columns = processedResults.length > 0
        ? generateColumnsFromData(processedResults)
        : [];

    return (
        <div className="flex flex-col m-4 gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Benchmarks</h1>
                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setShowBenchmarkDialog(true)}
                    >
                        <Play className="h-4 w-4" />
                        Benchmark a Function
                    </Button>
                    <div className="w-64">
                        <Select
                            value={String(selectedBenchmark)}
                            onValueChange={handleBenchmarkSelection}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select benchmark" />
                            </SelectTrigger>
                            <SelectContent>
                                {BENCHMARK_TYPES.map(benchmark => (
                                    <SelectItem
                                        key={benchmark.id}
                                        value={benchmark.id}
                                    >
                                        {benchmark.label}
                                    </SelectItem>
                                ))}
                                <SelectItem
                                    key={CREATE_NEW_BENCHMARK}
                                    value={CREATE_NEW_BENCHMARK}
                                    className="text-green-600 font-medium"
                                >
                                    <div className="flex items-center gap-1">
                                        <Plus className="h-4 w-4" />
                                        Create New Benchmark
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{benchmarkInfo.title}</CardTitle>
                    <CardDescription>
                        {benchmarkInfo.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {benchmarkInfo.metrics.map(metric => (
                            <span key={metric} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {metric}
                            </span>
                        ))}
                    </div>
                    <div className="mt-2 text-sm">
                        <a
                            href={benchmarkInfo.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View reference →
                        </a>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
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

                    {isFetching && !isLoading && (
                        <div className="flex justify-center items-center mt-4">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Updating results...</span>
                        </div>
                    )}
                </div>
            )}

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
                initialBenchmarkId={
                    // Find the numeric ID that corresponds to the currently selected benchmark
                    availableBenchmarks.find(b =>
                        b.name.toLowerCase().includes(String(selectedBenchmark))
                    )?.id || undefined
                }
            />
        </div>
    );
}