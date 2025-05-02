import { useQuery } from "@tanstack/react-query";
import { BenchmarkResult } from "../benchmarks-table/columns";

const getBenchmarkResults = async (): Promise<BenchmarkResult[]> => {
    const fakeBenchmarkData =
        [
            {
                function_name: "ML-FF Model",
                garden: "Materials Discovery",
                rmsd: 0.042,
                Ksrme: 0.157,
                rsqrd: 0.968,
                mae: 0.031,
                prec: 0.899,
                daf: 8.2,
                f1: 0.872,
                acc: 0.891,
                cps: 9.1
            },
            {
                function_name: "MACE Potential",
                garden: "Structure Prediction",
                rmsd: 0.037,
                Ksrme: 0.142,
                rsqrd: 0.982,
                mae: 0.023,
                prec: 0.912,
                daf: 9.7,
                f1: 0.903,
                acc: 0.927,
                cps: 9.5
            },
            {
                function_name: "Thermal Conductivity Predictor",
                garden: "Thermal Properties",
                rmsd: 0.053,
                Ksrme: 0.131,
                rsqrd: 0.941,
                mae: 0.045,
                prec: 0.876,
                daf: 7.8,
                f1: 0.864,
                acc: 0.882,
                cps: 8.7
            },
            {
                function_name: "Band Gap Estimator",
                garden: "Electronic Properties",
                rmsd: 0.049,
                Ksrme: 0.183,
                rsqrd: 0.937,
                mae: 0.051,
                prec: 0.852,
                daf: 7.1,
                f1: 0.841,
                acc: 0.858,
                cps: 7.9
            },
            {
                function_name: "Phase Stability Classifier",
                garden: "Thermodynamics",
                rmsd: 0.058,
                Ksrme: 0.196,
                rsqrd: 0.921,
                mae: 0.063,
                prec: 0.885,
                daf: 8.0,
                f1: 0.879,
                acc: 0.891,
                cps: 8.4
            }
        ];
    return fakeBenchmarkData;
}

export const useGetBenchmarkResults = () => {
    return useQuery({
        queryKey: ["benchmark-results"],
        queryFn: getBenchmarkResults,
    });
}