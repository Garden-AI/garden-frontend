// MatBench Discovery specific metadata and utilities
// Supports both known MatBench metrics and dynamic metric discovery from backend

import { BenchmarkResult } from "../types/benchmarks.types";
import { MetricInfo, BenchmarkInfo } from "../types/benchmarks.types";
import { MATBENCH_METRICS, MATBENCH_BENCHMARKS, ENVIRONMENT_METRIC_KEYS, EXCLUDED_METRIC_KEYS } from "./constants";

export { MATBENCH_METRICS, MATBENCH_BENCHMARKS, ENVIRONMENT_METRIC_KEYS, EXCLUDED_METRIC_KEYS };

// Re-export formatMetricValue for backward compatibility during refactor
import { formatMetricValue } from './formatting';
export { formatMetricValue };

// Get practical impact message for a model's performance
export const getPracticalImpact = (_f1Score?: number, daf?: number): string => {
  const acceleration = daf || 1;

  if (acceleration >= 5) {
    return `Could save years of lab work by screening materials ${acceleration.toFixed(1)}x faster`;
  } else if (acceleration >= 3) {
    return `Significantly accelerates materials discovery (${acceleration.toFixed(1)}x faster)`;
  } else if (acceleration >= 2) {
    return `Modest acceleration for materials screening (${acceleration.toFixed(1)}x faster)`;
  } else {
    return `Limited acceleration over random search (${acceleration.toFixed(1)}x)`;
  }
};

// Get performance tier based on F1 score and DAF
export const getPerformanceTier = (f1Score?: number, daf?: number): {
  tier: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  color: string;
} => {
  const f1 = f1Score || 0;
  const acceleration = daf || 1;

  if (f1 >= 0.85 && acceleration >= 4) {
    return {
      tier: 'excellent',
      description: 'Excellent for production use',
      color: 'text-green-700 bg-green-50 border-green-200',
    };
  } else if (f1 >= 0.7 && acceleration >= 2.5) {
    return {
      tier: 'good',
      description: 'Good for most applications',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    };
  } else if (f1 >= 0.5 && acceleration >= 1.5) {
    return {
      tier: 'fair',
      description: 'Fair performance, consider for specific use cases',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    };
  } else {
    return {
      tier: 'poor',
      description: 'Poor performance, needs improvement',
      color: 'text-red-700 bg-red-50 border-red-200',
    };
  }
};

// Helper to get display name for benchmark
export const getBenchmarkDisplayName = (benchmarkName: string): string => {
  // Check exact match in definitions
  if (MATBENCH_BENCHMARKS[benchmarkName]) {
    return MATBENCH_BENCHMARKS[benchmarkName].name;
  }

  // Check for common variations (underscore vs hyphen)
  const normalized = benchmarkName.replace(/_/g, '-');
  if (MATBENCH_BENCHMARKS[normalized]) {
    return MATBENCH_BENCHMARKS[normalized].name;
  }

  // Fallback: Title Case
  return benchmarkName
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

// Check if a benchmark is MatBench Discovery related
export const isMatBenchDiscovery = (benchmarkName: string): boolean => {
  const name = benchmarkName.toLowerCase();
  return name.includes('matbench') ||
    name.includes('discovery') ||
    name.includes('materials') ||
    name.includes('mat-bench') ||
    name.includes('material') ||
    // Add more specific patterns that might match your actual benchmark names
    name.includes('crystal') ||
    name.includes('stability') ||
    // Fallback: if it has typical matbench metrics, treat it as matbench
    false; // We'll add a data-based detection as backup
};

// Check if data contains MatBench-style metrics (fallback detection)
export const hasMatBenchMetrics = (data: Record<string, unknown>[]): boolean => {
  if (!data.length) return false;

  // Check if any of the data contains typical MatBench metrics (both cases)
  const matbenchMetricKeys = [
    'f1_score', 'daf', 'rmsd', 'thermal_conductivity_mae', // lowercase
    'F1', 'DAF', 'MAE', 'RMSE', 'Precision', 'Recall', 'Accuracy', 'R^2', 'RMSD' // uppercase
  ];
  const dataKeys = new Set<string>();

  data.forEach(item => {
    Object.keys(item).forEach(key => dataKeys.add(key));
  });

  // If we find 2 or more MatBench metrics, it's likely MatBench data
  const foundMetrics = matbenchMetricKeys.filter(metric => dataKeys.has(metric));

  return foundMetrics.length >= 2;
};

// ============================================================================
// Dynamic Metric Utilities
// ============================================================================

/**
 * Extract unique metric keys from benchmark results.
 * The metrics field in BenchmarkResultResponse is a dynamic object.
 */
export const extractMetricKeys = (results: BenchmarkResult[]): string[] => {
  const keys = new Set<string>();
  results.forEach(result => {
    if (result.metrics && typeof result.metrics === 'object') {
      const metricsBlob = result.metrics as Record<string, unknown>;

      // Check if metrics are nested under 'metrics' key
      if (metricsBlob.metrics && typeof metricsBlob.metrics === 'object') {
        // Extract keys from nested metrics.metrics (F1, DAF, force_r2, etc.)
        Object.keys(metricsBlob.metrics as Record<string, unknown>).forEach(key => keys.add(key));
      } else {
        // Fallback: extract keys directly, excluding structure keys
        const reservedKeys = ['metrics', 'run_metadata', '_benchmark_info'];
        Object.keys(metricsBlob).forEach(key => {
          if (!reservedKeys.includes(key)) {
            keys.add(key);
          }
        });
      }
    }
  });
  return Array.from(keys).sort();
};

/**
 * Infer metric info for unknown metrics based on naming conventions.
 * Falls back to known MATBENCH_METRICS if available.
 */
export const inferMetricInfo = (metricKey: string): MetricInfo => {
  // Check known metrics first
  if (MATBENCH_METRICS[metricKey]) {
    return MATBENCH_METRICS[metricKey];
  }

  // Infer from naming conventions
  const lowerKey = metricKey.toLowerCase();
  const betterIs: 'higher' | 'lower' =
    lowerKey.includes('error') ||
      lowerKey.includes('loss') ||
      lowerKey.includes('mae') ||
      lowerKey.includes('rmse') ||
      lowerKey.includes('mse') ||
      lowerKey.includes('fpr') ||
      lowerKey.includes('fnr')
      ? 'lower'
      : 'higher';

  return {
    name: metricKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: `Metric: ${metricKey}`,
    betterIs,
    format: 'decimal',
    decimalPlaces: 4,
  };
};

/**
 * Get unique benchmark names from results for sidebar navigation.
 */
export const getUniqueBenchmarkNames = (results: BenchmarkResult[]): string[] => {
  const names = new Set<string>();
  results.forEach(result => {
    if (result.benchmark_name) {
      names.add(result.benchmark_name);
    }
  });
  return Array.from(names).sort();
};

/**
 * Filter results by benchmark name.
 */
export const filterByBenchmarkName = (
  results: BenchmarkResult[],
  benchmarkName: string
): BenchmarkResult[] => {
  return results.filter(r => r.benchmark_name === benchmarkName);
};

/**
 * Transform BenchmarkResult array into a format suitable for tables/charts.
 * Extracts model name from nested run_metadata and flattens the actual metrics.
 * 
 * Expected metrics structure from backend:
 * {
 *   metrics: { F1, DAF, ... },
 *   run_metadata: { model: { model_name, ... }, hardware: {...}, timing: {...}, cost: {...} },
 *   _benchmark_info: { benchmark_name, task_name }
 * }
 */
export const transformResultsForDisplay = (
  results: BenchmarkResult[]
): Record<string, unknown>[] => {
  return results.map(result => {
    const metricsBlob = result.metrics as Record<string, unknown> || {};

    // Check if metrics are nested under 'metrics' key or directly in the blob
    // The structure can be either:
    // 1. { metrics: {F1, DAF...}, run_metadata: {...}, _benchmark_info: {...} }
    // 2. Direct keys if backend flattens them
    const hasNestedMetrics = metricsBlob.metrics &&
      typeof metricsBlob.metrics === 'object' &&
      !Array.isArray(metricsBlob.metrics);

    // Extract the actual benchmark metrics (F1, DAF, etc.)
    const actualMetrics = hasNestedMetrics
      ? (metricsBlob.metrics as Record<string, unknown>)
      : {};

    // Extract run_metadata (either from nested structure or top level)
    const runMetadata = (metricsBlob.run_metadata as Record<string, unknown>) || {};
    const modelInfo = (runMetadata.model as Record<string, unknown>) || {};
    const hardwareInfo = (runMetadata.hardware as Record<string, unknown>) || {};
    const timingInfo = (runMetadata.timing as Record<string, unknown>) || {};
    const costInfo = (runMetadata.cost as Record<string, unknown>) || {};
    const datasetInfo = (runMetadata.dataset as Record<string, unknown>) || {};
    const benchmarkInfo = (metricsBlob._benchmark_info as Record<string, unknown>) || {};

    // Get model name from nested structure
    let modelName = modelInfo.model_name as string ||
      benchmarkInfo.task_name as string ||
      result.benchmark_task_name ||
      'Unknown Model';

    // Append variant if available
    const modelVariant = modelInfo.variant as string;
    if (modelVariant) {
      modelName = `${modelName} (${modelVariant})`;
    }

    // Get task name
    const taskName = benchmarkInfo.task_name as string || result.benchmark_task_name || '';

    // If metrics aren't nested, try to extract numeric values from top level
    // that aren't the reserved structure keys
    let flatMetrics: Record<string, unknown> = {};
    if (!hasNestedMetrics) {
      const reservedKeys = ['metrics', 'run_metadata', '_benchmark_info'];
      Object.entries(metricsBlob).forEach(([key, value]) => {
        if (!reservedKeys.includes(key) && (typeof value === 'number' || typeof value === 'string')) {
          flatMetrics[key] = value;
        }
      });
    }

    return {
      id: result.id,
      benchmark_name: result.benchmark_name,
      benchmark_task_name: taskName,
      timestamp: result.timestamp,
      model_name: modelName,
      model_packages: modelInfo.model_packages,
      // Hardware metadata
      device_type: hardwareInfo.device_type,
      num_gpus: hardwareInfo.num_gpus,
      gpu_names: hardwareInfo.gpu_names,
      // gpu_memory_gb: hardwareInfo.gpu_memory_gb,
      // Timing metadata
      total_seconds: timingInfo.total_seconds,
      throughput_per_second: timingInfo.throughput_per_second,
      num_workers: timingInfo.num_workers,
      // Cost metadata
      // gpu_hourly_rate_usd: costInfo.gpu_hourly_rate_usd,
      total_gpu_hours: costInfo.total_gpu_hours,
      estimated_cost_usd: costInfo.estimated_cost_usd,
      estimated_cost_per_1000_structures_usd: costInfo.estimated_cost_per_1000_structures_usd,
      // Dataset metadata
      // num_structures_total: datasetInfo.num_structures_total,
      // num_structures_processed: datasetInfo.num_structures_processed,
      // Garden DOI for linking
      garden_doi: runMetadata.garden_doi,
      // Flatten actual metrics at the top level
      ...actualMetrics,
      ...flatMetrics,
    };
  });
};


/**
 * Extract unique metric keys from transformed display data.
 * Excludes metadata fields to only return actual benchmark metrics.
 */
export const getDisplayMetricKeys = (displayData: Record<string, unknown>[]): string[] => {
  const metadataKeys = [
    'id', 'benchmark_name', 'benchmark_task_name', 'timestamp', 'model_name', 'model_packages',
    ...EXCLUDED_METRIC_KEYS
  ];

  const keys = new Set<string>();
  displayData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!metadataKeys.includes(key)) {
        keys.add(key);
      }
    });
  });
  return Array.from(keys).sort();
};
