import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { isMatBenchDiscovery, hasMatBenchMetrics, MATBENCH_METRICS } from '../utils/matbench';
import { MetricDisplay, MetricHeader } from '../components/MetricDisplay';
import { getColorForValue } from '../utils/formatting';

// Default column sizes
const DEFAULT_COLUMN_SIZE = 80;
const MODEL_COLUMN_SIZE = 200;
const TASK_COLUMN_SIZE = 150;
const DATE_COLUMN_SIZE = 100;

// Helper function to extract numeric values
const getNumericValue = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return isNaN(value) ? null : value;
    }
    if (value && typeof value === 'object' && 'parsedValue' in value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedValue = (value as any).parsedValue;
        return typeof parsedValue === 'number' && !isNaN(parsedValue) ? parsedValue : null;
    }
    return null;
};

// Define column metadata type
export interface ColumnMeta {
    isMetricColumn?: boolean;
    getNumericValue?: (value: unknown) => number | null;
}

// Helper function to check if a value can be colored (is numeric) and get color direction
export const getNumericValueForColoring = (
    value: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: { columnDef: { meta?: ColumnMeta }; id: string },
    isMatBench: boolean
): { value: number; betterIs: 'higher' | 'lower' } | null => {
    // Only apply coloring to metric columns (not function names or dates)
    if (!column.columnDef.meta?.isMetricColumn) {
        return null;
    }

    // Get the numeric value
    let numericValue: number | null = null;
    if (column.columnDef.meta?.getNumericValue) {
        numericValue = column.columnDef.meta.getNumericValue(value);
    } else if (typeof value === 'number') {
        numericValue = value;
    }

    if (numericValue === null) {
        return null;
    }

    // Determine direction based on metric type
    let betterIs: 'higher' | 'lower' = 'higher'; // default

    if (isMatBench && MATBENCH_METRICS[column.id]) {
        betterIs = MATBENCH_METRICS[column.id].betterIs;
    }

    return { value: numericValue, betterIs };
};

// Helper to format cost/performance values
const formatCostPerformanceValue = (key: string, value: unknown): React.ReactNode => {
    if (value === undefined || value === null) return '—';

    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(numValue)) return String(value);

    switch (key) {
        case 'estimated_cost_usd':
            return <span className="font-mono text-amber-600 dark:text-amber-400">${numValue.toFixed(4)}</span>;
        case 'estimated_cost_per_1000_structures_usd':
            return <span className="font-mono text-amber-600 dark:text-amber-400">${numValue.toFixed(2)}/1K</span>;
        case 'total_gpu_hours':
            return <span className="font-mono">{numValue.toFixed(4)}h</span>;
        case 'total_seconds':
            if (numValue < 60) return <span className="font-mono">{numValue.toFixed(1)}s</span>;
            if (numValue < 3600) return <span className="font-mono">{(numValue / 60).toFixed(1)}m</span>;
            return <span className="font-mono">{(numValue / 3600).toFixed(2)}h</span>;
        case 'throughput_per_second':
            return <span className="font-mono text-green-600 dark:text-green-400">{numValue.toFixed(3)}/s</span>;
        case 'device_type': {
            const valStr = String(value).toLowerCase();
            const icon = valStr === 'cuda' ? '🎮' :
                valStr === 'mps' ? '🍎' : '💻';
            return <span>{icon} {String(value).toUpperCase()}</span>;
        }
        case 'num_gpus':
            return <span>{numValue} GPU{numValue !== 1 ? 's' : ''}</span>;
        default:
            return numValue.toFixed(3);
    }
};

export const useBenchmarkColumns = <TData extends Record<string, unknown>, TValue>(
    data: TData[],
    benchmarkName?: string
) => {
    return useMemo(() => {
        if (!data.length) return [];

        const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);

        // Get all unique keys from all data objects
        const allKeys = new Set<string>();
        // Only exclude true metadata that shouldn't be displayed as columns
        const reservedKeys = [
            'id', 'benchmark_name', 'benchmark_task_name', 'timestamp', 'model_name', 'model_packages',
            'gpu_names', 'num_workers'
        ];

        // Cost and performance keys that should be displayed as columns
        const costPerformanceKeys = [
            'device_type', 'num_gpus', 'total_seconds', 'throughput_per_second',
            'total_gpu_hours', 'estimated_cost_usd', 'estimated_cost_per_1000_structures_usd'
        ];

        data.forEach(item => {
            Object.keys(item).forEach(key => {
                // Include cost/performance keys and exclude only true metadata
                if (!reservedKeys.includes(key)) {
                    allKeys.add(key);
                }
            });
        });

        // Convert to array and organize - prioritize benchmark metrics, then cost/performance
        let keys = Array.from(allKeys);

        // Separate benchmark metrics from cost/performance metrics
        const benchmarkMetrics = keys.filter(k => !costPerformanceKeys.includes(k));
        const includedCostPerformance = keys.filter(k => costPerformanceKeys.includes(k));

        if (isMatBench) {
            const primaryMetrics = ['F1', 'DAF', 'Accuracy', 'f1_score', 'daf', 'accuracy'];
            const otherBenchmarkKeys = benchmarkMetrics.filter(k => !primaryMetrics.includes(k)).sort();
            keys = [
                ...primaryMetrics.filter(k => benchmarkMetrics.includes(k)),
                ...otherBenchmarkKeys,
                ...includedCostPerformance
            ];
        } else {
            keys = [...benchmarkMetrics.sort(), ...includedCostPerformance];
        }

        // Check if data has model_name field
        const hasModelName = data.some(item => 'model_name' in item && item.model_name);

        // Define model/task column first (using benchmark_task_name or model_name as identifier)
        const modelColumn = {
            accessorKey: hasModelName ? "model_name" : "benchmark_task_name",
            header: hasModelName ? "Model" : "Task",
            enableSorting: true,
            enableHiding: false, // Don't allow hiding the model column
            enableResizing: true,
            size: hasModelName ? MODEL_COLUMN_SIZE : TASK_COLUMN_SIZE,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }: any) => {
                const value = hasModelName
                    ? row.getValue("model_name")
                    : row.getValue("benchmark_task_name");
                return (
                    <div className="font-semibold text-primary truncate" title={String(value)}>
                        {String(value) || "Unknown"}
                    </div>
                );
            }
        } as ColumnDef<TData, TValue>;

        // Define date/timestamp column second
        const dateColumn = {
            accessorKey: "timestamp",
            header: "Date",
            enableSorting: true,
            enableHiding: true,
            enableResizing: true,
            size: DATE_COLUMN_SIZE,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }: any) => {
                const timestamp = row.getValue("timestamp");
                // If date is not available, return empty string
                if (!timestamp) return "";

                // Format as yyyy-mm-dd
                try {
                    const date = new Date(timestamp as string);
                    return date.toISOString().split('T')[0]; // Get yyyy-mm-dd part
                } catch {
                    return String(timestamp); // Return original value if parsing fails
                }
            }
        } as ColumnDef<TData, TValue>;

        // Create column definitions for other fields
        const dynamic_columns = keys.map(key => ({
            accessorKey: key,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            header: ({ column }: any) => {
                if (isMatBench && MATBENCH_METRICS[key]) {
                    return (
                        <MetricHeader
                            metricKey={key}
                            sortable={true}
                            onSort={() => column.toggleSorting()}
                            sortDirection={column.getIsSorted() || null}
                        />
                    );
                }
                // Ensure we use the friendly name from MATBENCH_METRICS if available, otherwise formatted key
                const metricInfo = MATBENCH_METRICS[key];
                if (metricInfo) {
                    // If it's a known metric (even cost/performance ones are now in MATBENCH_METRICS), use MetricHeader or name
                    // For simple text columns without special sorting, just return text
                    if (!metricInfo.isPrimaryMetric && !isMatBench && !costPerformanceKeys.includes(key)) {
                        return metricInfo.name;
                    }
                }

                // For all metrics (both MatBench and Cost/Performance), use MetricHeader if possible for consistent look
                // But MetricHeader interacts with sort.

                // Standardize: If it's in MATBENCH_METRICS, use its name.
                const displayName = metricInfo ? metricInfo.name : key;
                return displayName;
            },
            enableSorting: true,
            enableHiding: true,
            enableResizing: true,
            size: DEFAULT_COLUMN_SIZE,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }: any) => {
                const value = row.getValue(key);

                // Handle cost/performance columns
                if (costPerformanceKeys.includes(key)) {
                    return formatCostPerformanceValue(key, value);
                }

                if (isMatBench && MATBENCH_METRICS[key]) {
                    // Get F1 score and DAF for performance tier calculation (try both cases)
                    // Safely access values from the original data object instead of row.getValue()
                    // because row.getValue() throws if the column doesn't exist (e.g. in regression tasks without F1)
                    const originalData = row.original as Record<string, unknown>;
                    const f1Score = getNumericValue(originalData['F1']) || getNumericValue(originalData['f1_score']);
                    const daf = getNumericValue(originalData['DAF']) || getNumericValue(originalData['daf']);

                    return (
                        <MetricDisplay
                            metricKey={key}
                            value={value}
                            f1Score={f1Score || undefined}
                            daf={daf || undefined}
                            compact={true}
                        />
                    );
                }

                // Default formatting for non-MatBench metrics
                let displayValue: string | number | null = null;

                // Handle complex objects with parsedValue
                if (value && typeof value === 'object' && 'parsedValue' in value) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const parsedValue = (value as any).parsedValue;
                    if (typeof parsedValue === 'number') {
                        displayValue = parsedValue.toFixed(3);
                    } else {
                        displayValue = String(parsedValue);
                    }
                }
                // Handle number values
                else if (typeof value === 'number') {
                    displayValue = Number(value).toFixed(3);
                }
                // Other values
                else {
                    displayValue = (value === undefined || value === null) ? 'N/A' : String(value);
                }

                return displayValue;
            },
            // Store the numeric value in the column meta for coloring in the main table render
            meta: {
                isMetricColumn: true,
                getNumericValue: (value: unknown): number | null => {
                    return getNumericValue(value);
                }
            }
        })) as ColumnDef<TData, TValue>[];

        return [modelColumn, dateColumn, ...dynamic_columns];
    }, [data, benchmarkName]);
};
