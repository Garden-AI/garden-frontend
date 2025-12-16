import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/shadcn/card";
import { Loader2, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/shadcn/button";

import { BenchmarkInfo } from "./components/BenchmarkInfo";
import { TaskVisualization } from "./components/TaskVisualization";
import { BenchmarksSidebar } from "./components/BenchmarksSidebar";
import { MatBenchInfoAlert } from "./components/MatBenchInfoAlert";
import { MetricsExplanation } from "./components/MetricsExplanation";
import { useGetBenchmarks } from "./api/useGetBenchmarks";
import {
    isMatBenchDiscovery,
    getUniqueBenchmarkNames,
    filterByBenchmarkName,
    transformResultsForDisplay,
    extractMetricKeys,
} from "./utils/matbench";

export const BenchmarksPage = () => {
    const [selectedBenchmarkName, setSelectedBenchmarkName] = useState<string | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

    // Get all benchmark results
    const { data: benchmarkResults = [], isLoading } = useGetBenchmarks();

    // Get unique benchmark names for sidebar navigation
    const benchmarkNames = useMemo(() =>
        getUniqueBenchmarkNames(benchmarkResults),
        [benchmarkResults]
    );

    // Get filtered results for selected benchmark
    const selectedResults = useMemo(() => {
        if (!selectedBenchmarkName) return [];
        return filterByBenchmarkName(benchmarkResults, selectedBenchmarkName);
    }, [benchmarkResults, selectedBenchmarkName]);

    // Transform results for display in table/charts
    const displayData = useMemo(() =>
        transformResultsForDisplay(selectedResults),
        [selectedResults]
    );

    // Extract all metrics from selected results
    const allMetricKeys = useMemo(() =>
        extractMetricKeys(selectedResults),
        [selectedResults]
    );

    // Auto-select first benchmark if none selected
    useEffect(() => {
        if (!selectedBenchmarkName && benchmarkNames.length > 0) {
            setSelectedBenchmarkName(benchmarkNames[0]);
        }
    }, [benchmarkNames, selectedBenchmarkName]);

    // Get unique task names for the selected benchmark
    const taskNames = useMemo(() => {
        const names = new Set<string>();
        selectedResults.forEach(r => {
            if (r.benchmark_task_name) {
                names.add(r.benchmark_task_name);
            }
        });
        return Array.from(names);
    }, [selectedResults]);

    // Pre-calculate counts for sidebar to avoid O(N*M) in render
    const benchmarkCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        benchmarkResults.forEach(r => {
            if (r.benchmark_name) {
                counts[r.benchmark_name] = (counts[r.benchmark_name] || 0) + 1;
            }
        });
        return counts;
    }, [benchmarkResults]);

    return (
        <div className="flex h-full relative">
            {/* Mobile Menu Button */}
            <Button
                variant="outline"
                size="sm"
                className="lg:hidden fixed top-4 left-4 z-50 bg-background shadow-md"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
                {mobileSidebarOpen ? "×" : "☰"}
            </Button>

            {/* Mobile Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Benchmarks Sidebar */}
            <BenchmarksSidebar
                benchmarkNames={benchmarkNames}
                selectedBenchmarkName={selectedBenchmarkName}
                setSelectedBenchmarkName={setSelectedBenchmarkName}
                benchmarkCounts={benchmarkCounts}
                isLoading={isLoading}
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
                isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
                setIsDesktopSidebarCollapsed={setIsDesktopSidebarCollapsed}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto lg:pl-6 pl-16">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center h-full" >
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : selectedBenchmarkName ? (
                        <>
                            {/* Header Section */}
                            <div className="mb-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold">{selectedBenchmarkName}</h1>
                                    <div className="text-sm text-muted-foreground">
                                        {selectedResults.length} result{selectedResults.length !== 1 ? 's' : ''}
                                        {taskNames.length > 0 && (
                                            <span className="ml-2">
                                                ({taskNames.length} task{taskNames.length !== 1 ? 's' : ''})
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* MatBench Links and Info Bar */}
                                {isMatBenchDiscovery(selectedBenchmarkName) && (
                                    <MatBenchInfoAlert />
                                )}

                                {/* Navigation Hints */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ChevronDown className="h-4 w-4 animate-bounce" />
                                        <span>Scroll down for benchmark details and metric explanations</span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const metricsSection = document.getElementById('metrics-info');
                                            metricsSection?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="flex items-center gap-1 text-xs"
                                    >
                                        <Info className="h-3 w-3" />
                                        What do these metrics mean?
                                    </Button>
                                </div>
                            </div>

                            {/* Results Visualization */}
                            {displayData.length > 0 ? (
                                <Card>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-semibold">
                                            Benchmark Results
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            {displayData.length} model{displayData.length !== 1 ? 's' : ''} evaluated
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <TaskVisualization
                                            data={displayData}
                                            benchmarkName={selectedBenchmarkName}
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="text-center py-12 border rounded-md bg-gray-50">
                                    <p className="text-gray-500">No results available for this benchmark.</p>
                                </div>
                            )}

                            {/* Metrics Information Panel */}
                            <MetricsExplanation allMetricKeys={allMetricKeys} />

                            {/* Benchmark Information */}
                            <div className="mt-12 pt-8 border-t">
                                <BenchmarkInfo
                                    benchmarkName={selectedBenchmarkName}
                                    description={`Results from ${selectedBenchmarkName} benchmark runs.`}
                                    taskCount={taskNames.length}
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
            </div >
        </div >
    );
}

export default BenchmarksPage;