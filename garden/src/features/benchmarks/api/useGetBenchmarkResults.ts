import { useQuery } from "@tanstack/react-query";
import { BenchmarkResult } from "@/types";
import instance from "@/lib/axios";

/**
 * Fetches benchmark results for the given benchmark id and task id
 */
const getBenchmarkResults = async (benchmarkId: number, taskId: number): Promise<BenchmarkResult[]> => {
    const res = await instance.get(`/benchmarks/${benchmarkId}/${taskId}`);
    return res.data;
};

/**
 * Custom hook to fetch benchmark results
 * @param benchmarkId - The ID of the benchmark to fetch results for
 * @param taskId - The ID of the task to fetch results for
 */
export const useGetBenchmarkResults = (
    benchmarkId: number,
    taskId: number
) => {
    // Simple query to get benchmark results
    return useQuery({
        queryKey: ["benchmark-results", benchmarkId, taskId],
        queryFn: () => getBenchmarkResults(benchmarkId, taskId),
        // Don't auto-refetch - we'll do it manually when needed
        refetchInterval: false,
        // Override default stale time
        staleTime: 0,
    });
};