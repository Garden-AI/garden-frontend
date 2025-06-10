// MatBench Discovery specific metadata and utilities
// Hardcoded for now until backend provides rich benchmark metadata

export interface MetricInfo {
  name: string;
  description: string;
  betterIs: 'higher' | 'lower';
  format: 'decimal' | 'percentage' | 'integer';
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
export const getPracticalImpact = (f1Score?: number, daf?: number): string => {
  const f1 = f1Score || 0;
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
    'F1', 'DAF', 'MAE', 'RMSE', 'Precision', 'Recall', 'Accuracy' // uppercase
  ];
  const dataKeys = new Set<string>();
  
  data.forEach(item => {
    Object.keys(item).forEach(key => dataKeys.add(key));
  });
  
  // If we find 2 or more MatBench metrics, it's likely MatBench data
  const foundMetrics = matbenchMetricKeys.filter(metric => dataKeys.has(metric));
  
  return foundMetrics.length >= 2;
};