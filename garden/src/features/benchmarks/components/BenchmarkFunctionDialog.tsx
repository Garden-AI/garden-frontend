import React, { useState, useEffect } from "react";
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

interface BenchmarkFunctionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableBenchmarks: Array<{ id: number; name: string }>;
    initialBenchmarkId?: number;
    initialFunctionId?: number;
}

export const BenchmarkFunctionDialog = ({
    open,
    onOpenChange,
    availableBenchmarks,
    initialBenchmarkId,
    initialFunctionId,
}: BenchmarkFunctionDialogProps) => {
    // Mock available functions - in a real implementation these would be fetched from an API
    const availableFunctions = [
        { id: 2, name: "Hello" },
        { id: 3, name: "Goodbye" },
    ];

    const [selectedFunction, setSelectedFunction] = useState<string>(
        initialFunctionId ? initialFunctionId.toString() : ""
    );
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>(
        initialBenchmarkId ? initialBenchmarkId.toString() : ""
    );
    // Local state to track if dialog has been submitted successfully
    const [hasSubmitted, setHasSubmitted] = useState(false);
    // Local loading state that we control completely
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { benchmarkFunction, isSuccess, error } = useBenchmarkFunction();
    const queryClient = useQueryClient();

    const handleSubmit = () => {
        if (!selectedFunction || !selectedBenchmark) return;

        setIsSubmitting(true);
        setHasSubmitted(true);

        benchmarkFunction({
            function_id: parseInt(selectedFunction),
            benchmark_id: parseInt(selectedBenchmark),
            task_id: 0, // TODO: implement task id logic
        });
    };

    // Reset form when dialog closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedFunction("");
            setSelectedBenchmark("");
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
        }
    }, [open]);

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
                                <SelectTrigger id="function">
                                    <SelectValue placeholder="Select a function" />
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
                            disabled={!selectedFunction || !selectedBenchmark || isSubmitting}
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