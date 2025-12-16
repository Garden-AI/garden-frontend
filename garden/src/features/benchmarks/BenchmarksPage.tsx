import React from "react";
import { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/shadcn/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Loader2, ChevronDown, Info, ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/shadcn/button";

import { BenchmarkInfo } from "./components/BenchmarkInfo";
import { TaskVisualization } from "./components/TaskVisualization";
import { useGetBenchmarks } from "./api/useGetBenchmarks";
import { cn } from "@/utils/form.utils";
import {
    isMatBenchDiscovery,
    getUniqueBenchmarkNames,
    filterByBenchmarkName,
    transformResultsForDisplay,
    extractMetricKeys,
    inferMetricInfo,
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
            <div className={cn(
                "border-r h-full flex flex-col bg-background z-40",
                "fixed inset-y-0 left-0 transform transition-transform lg:relative lg:translate-x-0",
                "transition-[width,transform] duration-300 ease-in-out",
                mobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
                isDesktopSidebarCollapsed ? "lg:w-12" : "lg:w-64"
            )}>
                {/* Collapsed State Content (Desktop Only) */}
                <div className={cn(
                    "hidden lg:flex flex-col items-center pt-4 w-full",
                    isDesktopSidebarCollapsed ? "opacity-100 delay-300" : "opacity-0 pointer-events-none absolute"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDesktopSidebarCollapsed(false)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Expand sidebar"
                    >
                        <PanelLeftOpen className="h-5 w-5" />
                    </Button>
                </div>

                {/* Expanded State Content */}
                <div className={cn(
                    "flex flex-col h-full overflow-hidden transition-opacity duration-200",
                    isDesktopSidebarCollapsed ? "lg:opacity-0 lg:pointer-events-none" : "lg:opacity-100"
                )}>
                    <div className="flex justify-between items-center p-4">
                        <h2 className="font-semibold text-lg">Benchmarks</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsDesktopSidebarCollapsed(true)}
                            title="Collapse sidebar"
                        >
                            <PanelLeftClose className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="overflow-y-auto flex-1 px-4 pb-4">
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : benchmarkNames.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                No benchmarks available
                            </div>
                        ) : (
                            benchmarkNames.map((name) => {
                                const count = benchmarkResults.filter(r => r.benchmark_name === name).length;
                                return (
                                    <div
                                        key={name}
                                        className={cn(
                                            "p-2 rounded-md cursor-pointer mb-1 transition-colors",
                                            selectedBenchmarkName === name
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted"
                                        )}
                                        onClick={() => {
                                            setSelectedBenchmarkName(name);
                                            setMobileSidebarOpen(false);
                                        }}
                                    >
                                        <div className="font-medium truncate">{name}</div>
                                        {selectedBenchmarkName === name && (
                                            <div className="text-xs mt-1 text-primary-foreground/80">
                                                {count} result{count !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

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
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                                                    <Info className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-blue-900 mb-1">
                                                        MatBench Discovery Benchmark
                                                    </h3>
                                                    <p className="text-sm text-blue-800">
                                                        Evaluating AI models for accelerated materials discovery and crystal structure prediction
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="bg-white/50 hover:bg-white/80"
                                                >
                                                    <a
                                                        href="https://matbench-discovery.materialsproject.org/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1"
                                                    >
                                                        Website
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="bg-white/50 hover:bg-white/80"
                                                >
                                                    <a
                                                        href="https://doi.org/10.1038/s41467-023-43490-1"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1"
                                                    >
                                                        Paper
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
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
                            {allMetricKeys.length > 0 && (
                                <div className="mt-12 pt-8 border-t" id="metrics-info">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Info className="h-5 w-5 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold">Understanding the Metrics</h2>
                                    </div>

                                    <Accordion type="multiple" className="w-full">
                                        <AccordionItem value="performance" className="border-b-0 mb-4">
                                            <AccordionTrigger className="hover:no-underline py-4 px-4 sm:px-6 bg-gray-50/80 hover:bg-gray-100 border rounded-lg mb-4 transition-all data-[state=open]:rounded-b-none data-[state=open]:mb-0 data-[state=open]:border-b-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">📊</span>
                                                    <h3 className="text-lg font-medium">
                                                        Performance Metrics
                                                    </h3>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="border-x border-b rounded-b-lg px-4 sm:px-6 py-6 mt-0">
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    These metrics measure how well a model predicts material stability and properties.
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {allMetricKeys.filter(key =>
                                                        !['device_type', 'num_gpus', 'total_seconds', 'throughput_per_second',
                                                            'total_gpu_hours', 'estimated_cost_usd', 'estimated_cost_per_1000_structures_usd',
                                                            'num_structures_processed', 'num_structures_total'].includes(key)
                                                    ).map(key => {
                                                        const info = inferMetricInfo(key);
                                                        return (
                                                            <Card key={key} className={cn(
                                                                "p-4",
                                                                info.isPrimaryMetric && "border-primary/50 bg-primary/5"
                                                            )}>
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                                        <h4 className="font-medium flex flex-wrap items-center gap-2 mr-2">
                                                                            <span className="font-bold text-primary">{key}</span>
                                                                            <span className="text-muted-foreground">-</span>
                                                                            <span>{info.name}</span>
                                                                            {info.isPrimaryMetric && (
                                                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded whitespace-nowrap">
                                                                                    Key Metric
                                                                                </span>
                                                                            )}
                                                                        </h4>
                                                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                                            {info.betterIs === 'higher' ? '↗️ Higher is better' : '↘️ Lower is better'}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {info.description}
                                                                    </p>
                                                                    {info.unit && (
                                                                        <div className="text-xs text-muted-foreground">
                                                                            Unit: {info.unit}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="environment" className="border-b-0">
                                            <AccordionTrigger className="hover:no-underline py-4 px-4 sm:px-6 bg-gray-50/80 hover:bg-gray-100 border rounded-lg mb-4 transition-all data-[state=open]:rounded-b-none data-[state=open]:mb-0 data-[state=open]:border-b-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">⚡</span>
                                                    <h3 className="text-lg font-medium">
                                                        Run Environment & Cost
                                                    </h3>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="border-x border-b rounded-b-lg px-4 sm:px-6 py-6 mt-0">
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    These metrics help you compare the computational requirements and costs of running each model.
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {['device_type', 'num_gpus', 'total_seconds', 'throughput_per_second',
                                                        'total_gpu_hours', 'estimated_cost_usd', 'estimated_cost_per_1000_structures_usd'].map(key => {
                                                            const info = inferMetricInfo(key);
                                                            const categoryColors: Record<string, string> = {
                                                                'device_type': 'border-slate-400/50 bg-slate-50/50 dark:bg-slate-900/50',
                                                                'num_gpus': 'border-slate-400/50 bg-slate-50/50 dark:bg-slate-900/50',
                                                                'total_seconds': 'border-green-400/50 bg-green-50/50 dark:bg-green-900/50',
                                                                'throughput_per_second': 'border-green-400/50 bg-green-50/50 dark:bg-green-900/50',
                                                                'total_gpu_hours': 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/50',
                                                                'estimated_cost_usd': 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/50',
                                                                'estimated_cost_per_1000_structures_usd': 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/50',
                                                            };
                                                            return (
                                                                <Card key={key} className={cn(
                                                                    "p-4",
                                                                    categoryColors[key] || "",
                                                                    info.isPrimaryMetric && "border-primary/50"
                                                                )}>
                                                                    <div className="space-y-2">
                                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                                            <h4 className="font-medium flex flex-wrap items-center gap-2 mr-2">
                                                                                <span className="font-bold text-primary">{key}</span>
                                                                                <span className="text-muted-foreground">-</span>
                                                                                <span>{info.name}</span>
                                                                                {info.isPrimaryMetric && (
                                                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded whitespace-nowrap">
                                                                                        Key Metric
                                                                                    </span>
                                                                                )}
                                                                            </h4>
                                                                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                                                {info.betterIs === 'higher' ? '↗️ Higher is better' : '↘️ Lower is better'}
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {info.description}
                                                                        </p>
                                                                        {info.unit && (
                                                                            <div className="text-xs text-muted-foreground">
                                                                                Unit: {info.unit}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Card>
                                                            );
                                                        })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            )}

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