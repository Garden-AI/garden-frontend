import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface BenchmarkFunctionParams {
    benchmark_id: number;
    function_id: number;
}

interface BenchmarkFunctionResponse {
    id: number;
    status: "pending" | "running" | "completed" | "failed";
    message: string;
}

export const useBenchmarkFunction = () => {
    // NOTE: TODO: This is a mock implementation for now until we have the backend routes setup
    const [isLoading, setIsLoading] = useState(false);

    const benchmarkFunction = async (params: BenchmarkFunctionParams): Promise<BenchmarkFunctionResponse> => {
        setIsLoading(true);

        try {
            // In a real implementation, this would be an actual API call
            // const response = await fetch("/benchmarks", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(params),
            // });
            // return await response.json();

            console.log("Benchmarking function with params:", params);

            // Mock implementation
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: Math.floor(Math.random() * 1000),
                        status: "pending",
                        message: "Benchmark job created successfully",
                    });
                    setIsLoading(false);
                }, 1000);
            });
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: benchmarkFunction,
    });

    return {
        benchmarkFunction: mutation.mutate,
        isLoading: isLoading || mutation.isPending,
        isSuccess: mutation.isSuccess,
        error: mutation.error,
        data: mutation.data,
    };
}; 