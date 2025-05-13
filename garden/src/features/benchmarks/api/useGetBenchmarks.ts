import instance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";


const getBenchmarks = async () => {
    const res = await instance.get("/benchmarks");
    return res.data;
}

export const useGetBenchmarks = () => {
    return useQuery({
        queryKey: ["benchmarks"],
        queryFn: () => getBenchmarks(),
    });
}