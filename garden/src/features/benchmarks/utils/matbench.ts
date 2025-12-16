// MatBench Discovery specific metadata and utilities
// Supports both known MatBench metrics and dynamic metric discovery from backend

import { BenchmarkResult } from "../api/useGetBenchmarks";

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

// MatBench Discovery metric definitions
export const MATBENCH_METRICS: Record<string, MetricInfo> = {
  // Lowercase versions (for mock data)
  f1_score: {
    name: 'F1 Score',
    description: 'Harmonic mean of precision and recall for stability prediction accuracy',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
    isPrimaryMetric: true,
  },
  daf: {
    name: 'Discovery Acceleration Factor',
    description: 'How many times faster this model finds stable materials vs random search',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 2,
    unit: 'x faster',
    isPrimaryMetric: true,
  },
  accuracy: {
    name: 'Accuracy',
    description: 'Percentage of correct stability predictions',
    betterIs: 'higher',
    format: 'percentage',
    decimalPlaces: 1,
  },
  precision: {
    name: 'Precision',
    description: 'Of predicted stable materials, what percentage are actually stable',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  recall: {
    name: 'Recall',
    description: 'Of all stable materials, what percentage did the model find',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  // Uppercase versions (for real backend data)
  'F1': {
    name: 'F1 Score',
    description: 'Harmonic mean of precision and recall for stability prediction accuracy',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
    isPrimaryMetric: true,
  },
  'DAF': {
    name: 'Discovery Acceleration Factor',
    description: 'How many times faster this model finds stable materials vs random search',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 2,
    unit: 'x faster',
    isPrimaryMetric: true,
  },
  'Accuracy': {
    name: 'Accuracy',
    description: 'Percentage of correct stability predictions',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'Precision': {
    name: 'Precision',
    description: 'Of predicted stable materials, what percentage are actually stable',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'Recall': {
    name: 'Recall',
    description: 'Of all stable materials, what percentage did the model find',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'MAE': {
    name: 'Mean Absolute Error',
    description: 'Average absolute difference between predicted and actual values',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
  },
  'RMSE': {
    name: 'Root Mean Square Error',
    description: 'Square root of the average squared differences between predicted and actual values',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
  },
  'R2': {
    name: 'R² Score',
    description: 'Coefficient of determination - how well the model explains variance in the data',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'TPR': {
    name: 'True Positive Rate',
    description: 'Sensitivity - proportion of actual positives correctly identified',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'FPR': {
    name: 'False Positive Rate',
    description: 'Proportion of actual negatives incorrectly identified as positive',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'TNR': {
    name: 'True Negative Rate',
    description: 'Specificity - proportion of actual negatives correctly identified',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'FNR': {
    name: 'False Negative Rate',
    description: 'Proportion of actual positives incorrectly identified as negative',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 3,
  },
  // Confusion matrix values
  'TP': {
    name: 'True Positives',
    description: 'Number of correctly predicted stable materials',
    betterIs: 'higher',
    format: 'integer',
    decimalPlaces: 0,
  },
  'TN': {
    name: 'True Negatives',
    description: 'Number of correctly predicted unstable materials',
    betterIs: 'higher',
    format: 'integer',
    decimalPlaces: 0,
  },
  'FP': {
    name: 'False Positives',
    description: 'Number of incorrectly predicted stable materials (Type I errors)',
    betterIs: 'lower',
    format: 'integer',
    decimalPlaces: 0,
  },
  'FN': {
    name: 'False Negatives',
    description: 'Number of incorrectly predicted unstable materials (Type II errors)',
    betterIs: 'lower',
    format: 'integer',
    decimalPlaces: 0,
  },
  'R^2': {
    name: 'R² Score',
    description: 'Coefficient of determination - how well the model explains variance in the data',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
  },
  'RMSD': {
    name: 'RMSD',
    description: 'Root Mean Square Displacement for structure optimization accuracy',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 3,
    unit: 'Å',
  },
  // S2EF and S2EFS task metrics - Energy predictions
  'energy_r2': {
    name: 'Energy R²',
    description: 'How well the model predicts total energy (coefficient of determination)',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 4,
    isPrimaryMetric: true,
  },
  'energy_mae': {
    name: 'Energy MAE',
    description: 'Mean absolute error of energy predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'eV',
  },
  'energy_rmse': {
    name: 'Energy RMSE',
    description: 'Root mean square error of energy predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'eV',
  },
  // S2EF and S2EFS task metrics - Force predictions
  'force_r2': {
    name: 'Force R²',
    description: 'How well the model predicts atomic forces (coefficient of determination)',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 4,
    isPrimaryMetric: true,
  },
  'force_mae': {
    name: 'Force MAE',
    description: 'Mean absolute error of force predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'eV/Å',
  },
  'force_rmse': {
    name: 'Force RMSE',
    description: 'Root mean square error of force predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'eV/Å',
  },
  // S2EF and S2EFS task metrics - Stress predictions
  'stress_r2': {
    name: 'Stress R²',
    description: 'How well the model predicts stress tensor (coefficient of determination)',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 4,
  },
  'stress_mae': {
    name: 'Stress MAE',
    description: 'Mean absolute error of stress predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'eV/Å³',
  },
  'stress_rmse': {
    name: 'Stress RMSE',
    description: 'Root mean square error of stress predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'eV/Å³',
  },
  // Dataset info
  // Dataset info
  // (Removed as per user request)
  // ============================================================================
  // Run Metadata & Hardware Metrics
  // ============================================================================
  // Hardware Info
  'device_type': {
    name: 'Device Type',
    description: 'The type of compute device used: CUDA (NVIDIA GPU), MPS (Apple Silicon), or CPU',
    betterIs: 'higher',
    format: 'text',
    decimalPlaces: 0,
  },
  'num_gpus': {
    name: 'GPUs',
    description: 'Total number of GPUs used for this benchmark run. More GPUs can improve throughput.',
    betterIs: 'higher',
    format: 'integer',
    decimalPlaces: 0,
  },
  // Timing Metrics
  'total_seconds': {
    name: 'Runtime',
    description: 'Total wall-clock time to complete the benchmark. Includes model loading and all structure evaluations.',
    betterIs: 'lower',
    format: 'duration',
    decimalPlaces: 1,
    unit: 'seconds',
  },
  'throughput_per_second': {
    name: 'Throughput',
    description: 'Number of structures evaluated per second. Higher throughput means faster inference.',
    betterIs: 'higher',
    format: 'decimal',
    decimalPlaces: 3,
    unit: 'structures/sec',
    isPrimaryMetric: true,
  },
  'num_workers': {
    name: 'Number of Workers',
    description: 'Number of parallel workers used for data loading and processing.',
    betterIs: 'higher',
    format: 'integer',
    decimalPlaces: 0,
  },
  // Cost Metrics
  'total_gpu_hours': {
    name: 'GPU Hrs',
    description: 'Total GPU compute time consumed (runtime × number of GPUs). Key metric for compute budget.',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 4,
    unit: 'GPU-hours',
  },
  'estimated_cost_usd': {
    name: 'Cost ($)',
    description: 'Estimated cloud compute cost based on GPU hours and typical cloud GPU pricing.',
    betterIs: 'lower',
    format: 'currency',
    decimalPlaces: 4,
    unit: 'USD',
  },
  'estimated_cost_per_1000_structures_usd': {
    name: '$/1k Structs',
    description: 'Estimated cost to evaluate 1,000 structures. Useful for comparing efficiency across different dataset sizes.',
    betterIs: 'lower',
    format: 'currency',
    decimalPlaces: 4,
    unit: 'USD/1K',
    isPrimaryMetric: true,
  },
  // (Removed as per user request)
  // Dataset Metrics
  // (Removed as per user request to hide these metrics)
  // Legacy lowercase for compatibility
  rmsd: {
    name: 'RMSD',
    description: 'Root Mean Square Displacement for structure optimization accuracy',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 3,
    unit: 'Å',
  },
  latency_ms: {
    name: 'Latency',
    description: 'Average time to make a prediction',
    betterIs: 'lower',
    format: 'integer',
    unit: 'ms',
  },
  thermal_conductivity_mae: {
    name: 'Thermal Conductivity MAE',
    description: 'Mean absolute error for thermal conductivity predictions',
    betterIs: 'lower',
    format: 'decimal',
    decimalPlaces: 3,
    unit: 'W/mK',
  },
};

// MatBench Discovery benchmark definitions
export const MATBENCH_BENCHMARKS: Record<string, BenchmarkInfo> = {
  'matbench-discovery': {
    id: 'matbench-discovery',
    name: 'MatBench Discovery',
    description: 'Evaluates ML models for predicting stable inorganic crystal structures',
    detailedDescription: 'MatBench Discovery simulates high-throughput discovery of new stable inorganic crystals. Models are evaluated on their ability to predict which crystal structures will be thermodynamically stable, helping accelerate materials discovery.',
    purpose: 'Find stable materials faster than traditional methods',
    learnMoreUrl: 'https://matbench-discovery.materialsproject.org/',
  },
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

// Format metric value for display
export const formatMetricValue = (value: unknown, metricKey: string): string => {
  if (value === undefined || value === null) return 'N/A';

  const metric = MATBENCH_METRICS[metricKey];
  if (!metric) return String(value);

  let numValue: number;

  // Handle complex objects with parsedValue
  if (value && typeof value === 'object' && 'parsedValue' in value) {
    numValue = (value as { parsedValue: number }).parsedValue;
  } else if (typeof value === 'number') {
    numValue = value;
  } else {
    return String(value);
  }

  if (isNaN(numValue)) return 'N/A';

  switch (metric.format) {
    case 'percentage':
      return `${(numValue * 100).toFixed(metric.decimalPlaces || 1)}%`;
    case 'integer':
      return numValue.toFixed(0);
    case 'decimal':
      return numValue.toFixed(metric.decimalPlaces || 3);
    default:
      return numValue.toFixed(3);
  }
};

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
    const modelName = modelInfo.model_name as string ||
      benchmarkInfo.task_name as string ||
      result.benchmark_task_name ||
      'Unknown Model';

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
    'device_type', 'num_gpus', 'gpu_names',
    'total_seconds', 'throughput_per_second', 'num_workers',
    'total_gpu_hours', 'estimated_cost_usd', 'estimated_cost_per_1000_structures_usd'
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
