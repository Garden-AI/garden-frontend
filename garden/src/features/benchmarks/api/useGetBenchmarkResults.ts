import { useQuery } from "@tanstack/react-query";
import { BenchmarkResult } from "@/types";
import instance from "@/lib/axios";

/**
 * Fetches benchmark results for the given benchmark id
 */
const getBenchmarkResults = async (benchmarkId: number): Promise<BenchmarkResult[]> => {
    const res = await instance.get(`/benchmarks/${benchmarkId}`);
    return res.data;
};

/**
 * Custom hook to fetch benchmark results with auto-polling for pending results
 * @param benchmarkId - The ID of the benchmark to fetch results for
 * @param pollingInterval - The interval in milliseconds to poll for updates (default: 3000ms)
 * @param maxRetries - Maximum number of retries before stopping polling (default: 20)
 */
export const useGetBenchmarkResults = (
    benchmarkId: number,
    pollingInterval: number = 200,
    maxRetries: number = 10,
) => {
    return useQuery({
        queryKey: ["benchmark-results", benchmarkId],
        queryFn: () => getBenchmarkResults(benchmarkId),
        // Set a simple polling interval that checks if any results are pending
        refetchInterval: (data) => {
            let count = 0;
            if (!data) return false;

            // Ensure data is an array
            if (!Array.isArray(data)) return false;

            // Check if any results are pending
            const hasPendingResults = data.some((result: BenchmarkResult) =>
                result.status === "pending"
            );

            count++;
            // Only poll if we have pending results
            return (hasPendingResults && count <= maxRetries) ? pollingInterval : false;
        },
        // Stop polling if no pending results
        refetchOnWindowFocus: false,
        // Stale time of 0 ensures we always fetch fresh data
        staleTime: 0,
    });
};