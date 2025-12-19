import { BenchmarkResult } from "../api/useGetBenchmarks";

export type { BenchmarkResult };

export interface MetricInfo {
    name: string;
    description: string;
    betterIs: 'higher' | 'lower';
    format: 'decimal' | 'percentage' | 'integer' | 'text' | 'duration' | 'currency';
    unit?: string;
    decimalPlaces?: number;
    isPrimaryMetric?: boolean;
}

export interface BenchmarkInfo {
    id: string;
    name: string;
    description: string;
    detailedDescription: string;
    purpose: string;
    learnMoreUrl?: string;
}

export interface RunMetadata {
    // Model info
    model_name?: string;
    model_packages?: string[];

    // Hardware info
    device_type?: string;
    num_gpus?: number;
    gpu_names?: string[];
    gpu_memory_gb?: number | null;

    // Timing info
    total_seconds?: number;
    throughput_per_second?: number;
    num_workers?: number;

    // Cost info
    gpu_hourly_rate_usd?: number;
    total_gpu_hours?: number;
    estimated_cost_usd?: number;
    estimated_cost_per_1000_structures_usd?: number;

    // Dataset info
    num_structures_total?: number;
    num_structures_processed?: number;
}
