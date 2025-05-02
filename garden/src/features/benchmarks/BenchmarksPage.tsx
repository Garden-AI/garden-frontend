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
import { Loader2, Plus } from "lucide-react";

import { BenchmarksTable } from "./benchmarks-table/BenchmarksTable";
import { columns } from "./benchmarks-table/columns";
import { useGetBenchmarkResults } from "./api/useGetBenchmarkResults";

// Predefined benchmark types - only Matbench for now, structure for future expansion
const BENCHMARK_TYPES = [
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
    const [selectedBenchmark, setSelectedBenchmark] = useState("matbench_discovery");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const { data, isLoading } = useGetBenchmarkResults(selectedBenchmark);

    const benchmarkInfo = BENCHMARK_INFO[selectedBenchmark as keyof typeof BENCHMARK_INFO];

    const handleBenchmarkSelection = (value: string) => {
        if (value === CREATE_NEW_BENCHMARK) {
            setShowCreateDialog(true);
            // Keep the previous selection active in the dropdown
            return;
        }

        setSelectedBenchmark(value);
    };

    return (
        <div className="flex flex-col m-4 gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Benchmarks</h1>
                <div className="w-64">
                    <Select
                        value={selectedBenchmark}
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
                <BenchmarksTable columns={columns} data={data || []} />
            )}

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Benchmark</DialogTitle>
                        <DialogDescription>
                            This feature is coming soon! You'll be able to define your own custom benchmarks
                            and run your functions against them.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 text-center">
                        <div className="text-3xl mb-2">🚧</div>
                        <p className="text-gray-600">
                            We're building support for custom benchmarks that will allow you to:
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
        </div>
    );
}