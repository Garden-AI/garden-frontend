import React from "react";
import { Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/utils/form.utils";
import { getBenchmarkDisplayName } from "../utils/matbench";

interface BenchmarksSidebarProps {
    benchmarkNames: string[];
    selectedBenchmarkName: string | null;
    setSelectedBenchmarkName: (name: string) => void;
    benchmarkCounts: Record<string, number>;
    isLoading: boolean;
    mobileSidebarOpen: boolean;
    setMobileSidebarOpen: (open: boolean) => void;
    isDesktopSidebarCollapsed: boolean;
    setIsDesktopSidebarCollapsed: (collapsed: boolean) => void;
}

export const BenchmarksSidebar = ({
    benchmarkNames,
    selectedBenchmarkName,
    setSelectedBenchmarkName,
    benchmarkCounts,
    isLoading,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    isDesktopSidebarCollapsed,
    setIsDesktopSidebarCollapsed
}: BenchmarksSidebarProps) => {
    return (
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
                            const count = benchmarkCounts[name] || 0;
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
                                    <div className="font-medium truncate">{getBenchmarkDisplayName(name)}</div>
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
    );
}
