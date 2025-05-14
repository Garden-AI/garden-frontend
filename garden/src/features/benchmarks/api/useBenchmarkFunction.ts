import instance from "@/lib/axios";
import { BenchmarkRequest, BenchmarkResult } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useBenchmarkFunction = (benchmarkId: number, taskId: number) => {
    const [isLoading, setIsLoading] = useState(false);

    const benchmarkFunction = async (params: BenchmarkRequest): Promise<BenchmarkResult> => {
        setIsLoading(true);

        try {
            const res = await instance.post(
                `/benchmarks/${benchmarkId}/${taskId}`,
                params,
            )
            return await res.data;
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