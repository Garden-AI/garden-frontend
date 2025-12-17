import { ENVIRONMENT_METRIC_KEYS, EXCLUDED_METRIC_KEYS, MATBENCH_METRICS, MODEL_COLORS } from './constants';

export { MODEL_COLORS }; // Re-export for convenience

// Helper function to extract numeric value
export const getNumericValue = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return isNaN(value) ? null : value;
    }
    if (value && typeof value === 'object' && 'parsedValue' in value) {
        const parsedValue = (value as { parsedValue: unknown }).parsedValue;
        return typeof parsedValue === 'number' && !isNaN(parsedValue) ? parsedValue : null;
    }
    return null;
};

// Get available numeric metrics
export const getAvailableMetrics = (data: Record<string, unknown>[]): string[] => {
    if (!data.length) return [];

    // Reserved keys that shouldn't be available as metrics
    const reservedKeys = [
        'id',
        'benchmark_name',
        'benchmark_task_name',
        'timestamp',
        'model_name',
        ...EXCLUDED_METRIC_KEYS
    ];

    const numericKeys = new Set<string>();
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (!reservedKeys.includes(key)) {
                const value = getNumericValue(item[key]);
                if (value !== null) {
                    numericKeys.add(key);
                }
            }
        });
    });

    return Array.from(numericKeys).sort();
};

// Get model name from data item
export const getModelName = (item: Record<string, unknown>, index: number): string => {
    if (item.model_name) return String(item.model_name);
    if (item.benchmark_task_name) return String(item.benchmark_task_name);
    return `Model #${index + 1}`;
};

// Deterministically map a string to a color index
export const stringToColorIndex = (str: string, max: number): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
};

// Generate color for a model based on its name (consistent across charts)
export const getModelColor = (modelName: string): string => {
    const index = stringToColorIndex(modelName, MODEL_COLORS.length);
    return MODEL_COLORS[index];
};

// Normalize values to 0-100 scale
export const normalizeValue = (value: number, metric: string, allValues: number[]): number => {
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    if (min === max) return 50; // If all values are the same

    // Standard linear normalization: (value - min) / (max - min) * 100
    // Note: For "lower is better" metrics, we might want to invert this elsewhere, 
    // but typically radar charts show "more is better" (outward), so if lower is better,
    // a SMALL value should perhaps be far out? 
    // Actually, usually radar charts plot raw magnitude normalized. 
    // If we want "better" to always be outward, we'd invert.
    // BUT the existing implementation just did linear normalization. 
    // Let's stick to simple normalization for now to match behavior.

    const normalized = ((value - min) / (max - min)) * 100;

    return Math.round(normalized);
};
