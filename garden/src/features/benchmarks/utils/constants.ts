import { BenchmarkInfo, MetricInfo } from "../types/benchmarks.types";

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
    // Run Metadata & Hardware Metrics
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

export const ENVIRONMENT_METRIC_KEYS = [
    'device_type', 'num_gpus', 'total_seconds', 'throughput_per_second',
    'total_gpu_hours', 'estimated_cost_usd', 'estimated_cost_per_1000_structures_usd',
    'num_structures_processed', 'num_structures_total', 'num_workers', 'gpu_names'
];

/**
 * Metric keys that should be hidden from all visualizations, tables, and selectors.
 * This includes confusion matrix values (too granular), legacy environment metrics, This
 * and internal metadata that might appear as metrics.
 */
export const EXCLUDED_METRIC_KEYS = [
    // Confusion matrix - too detailed for high level dashboard
    'TP', 'TN', 'FP', 'FN',
    'TPR', 'FPR', 'TNR', 'FNR',
    // Environment / internal metrics to hide
    'num_evaluated',
    'num_structures',
    'num_structures_processed',
    'num_structures_total',
    'num_workers',
    'gpu_names',
    'garden_doi',
    // We explicitly allow cost & throughput metrics:
    // estimated_cost_usd, estimated_cost_per_1000_structures_usd, total_gpu_hours,
    // throughput_per_second, total_seconds, device_type, num_gpus
];

export const MODEL_COLORS = [
    '#2563eb', // blue-600
    '#dc2626', // red-600
    '#16a34a', // green-600
    '#9333ea', // purple-600
    '#f97316', // orange-500
    '#14b8a6', // teal-500
    '#db2777', // pink-600
    '#ca8a04', // yellow-600
    '#4f46e5', // indigo-600
    '#84cc16', // lime-500
    '#c026d3', // fuchsia-600
    '#475569', // slate-600
];
