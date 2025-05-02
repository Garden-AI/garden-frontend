import instance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Benchmark } from "../types";

const getBenchmarks = async (): Promise<Benchmark[]> => {
    const res = await instance.get("/benchmarks");
    return res.data;
}

export const useGetBenchmarks = () => {
    return useQuery<Benchmark[]>({
        queryKey: ["benchmarks"],
        queryFn: () => getBenchmarks(),
    });
}