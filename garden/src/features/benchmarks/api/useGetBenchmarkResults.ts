import { useQuery } from "@tanstack/react-query";
import { BenchmarkResult } from "../benchmarks-table/columns";

// Matbench Discovery benchmark data
const matbenchDiscoveryData: BenchmarkResult[] = [
    {
        function_name: "ML-FF Model",
        function_id: "ml-ff-1",
        garden: "Materials Discovery",
        garden_doi: "10.18126/123456",
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
        function_id: "mace-pot-2",
        garden: "Structure Prediction",
        garden_doi: "10.18126/234567",
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
        function_id: "thermal-pred-3",
        garden: "Thermal Properties",
        garden_doi: "10.18126/345678",
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
        function_id: "band-gap-4",
        garden: "Electronic Properties",
        garden_doi: "10.18126/456789",
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
        function_id: "phase-stab-5",
        garden: "Thermodynamics",
        garden_doi: "10.18126/567890",
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

const getBenchmarkResults = async (benchmarkType: string): Promise<BenchmarkResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Currently only Matbench Discovery is supported
    // We'll use the benchmarkType parameter in future when supporting more benchmarks
    console.log(`Loading benchmark data for: ${benchmarkType}`);
    return matbenchDiscoveryData;
}

export const useGetBenchmarkResults = (benchmarkType: string = "matbench_discovery") => {
    return useQuery({
        queryKey: ["benchmark-results", benchmarkType],
        queryFn: () => getBenchmarkResults(benchmarkType),
    });
}