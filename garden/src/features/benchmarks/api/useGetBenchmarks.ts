import instance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { components } from "@/types/backend-schema";

export type BenchmarkResult = components["schemas"]["BenchmarkResultResponse"];

const getBenchmarks = async (): Promise<BenchmarkResult[]> => {
    const res = await instance.get("/benchmarks");
    return res.data;
}

export const useGetBenchmarks = () => {
    return useQuery<BenchmarkResult[]>({
        queryKey: ["benchmarks"],
        queryFn: () => getBenchmarks(),
    });
}