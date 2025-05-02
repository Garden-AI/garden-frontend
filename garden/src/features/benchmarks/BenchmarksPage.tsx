import React from "react";

import { BenchmarksTable } from "./benchmarks-table/BenchmarksTable";
import { columns } from "./benchmarks-table/columns";
import { useGetBenchmarkResults } from "./api/useGetBenchmarkResults";


export const BenchmarksPage = () => {
    const { data } = useGetBenchmarkResults();
    return (
        <div className="flex flex-col m-4 gap-4">
            <h1 className="text-2xl font-bold">Benchmarks</h1>
            <BenchmarksTable columns={columns} data={data || []} />
        </div>
    )
}