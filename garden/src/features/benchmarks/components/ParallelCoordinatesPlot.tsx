import React, { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Button } from '@/components/shadcn/button';
import {
    ChartContainer,
    type ChartConfig
} from '@/components/shadcn/chart';
import { Badge } from '@/components/shadcn/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    MATBENCH_METRICS,
    isMatBenchDiscovery,
    hasMatBenchMetrics,
    formatMetricValue
} from '../utils/matbench';

interface ParallelCoordinatesProps {
    data: Record<string, unknown>[];
    benchmarkName?: string;
    compact?: boolean;
}

// Helper: Extract numeric value
const getNumericValue = (value: unknown): number | null => {
    if (typeof value === 'number') return isNaN(value) ? null : value;
    if (value && typeof value === 'object' && 'parsedValue' in value) {
        const parsedValue = (value as { parsedValue: unknown }).parsedValue;
        return typeof parsedValue === 'number' && !isNaN(parsedValue) ? parsedValue : null;
    }
    return null;
};

// Available metrics from data
const getAvailableMetrics = (data: Record<string, unknown>[]): string[] => {
    if (!data.length) return [];
    const reservedKeys = ['id', 'benchmark_name', 'benchmark_task_name', 'timestamp', 'model_name',
        'device_type', 'num_gpus', 'total_seconds', 'throughput_per_second'];
    const numericKeys = new Set<string>();
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (!reservedKeys.includes(key)) {
                const value = getNumericValue(item[key]);
                if (value !== null) numericKeys.add(key);
            }
        });
    });
    return Array.from(numericKeys).sort();
};

// Normalize value 0-100
const normalizeValue = (value: number, metric: string, allValues: number[]): number => {
    const metricInfo = MATBENCH_METRICS[metric];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    if (min === max) return 50;

    let normalized;
    // Standard linear normalization: (value - min) / (max - min) * 100
    // "Lower is better" metrics will have low values at 0 and high values at 100.
    // This preserves the absolute nature of the data (low cost = low y-value).
    normalized = ((value - min) / (max - min)) * 100;

    return Math.round(normalized);
};

// Helper: Color generation
const stringToColorIndex = (str: string, max: number): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % max;
};

const MODEL_COLORS = [
    '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#f97316', '#14b8a6',
    '#db2777', '#ca8a04', '#4f46e5', '#84cc16', '#c026d3', '#475569',
];

const getModelName = (item: Record<string, unknown>, index: number): string => {
    if (item.model_name) return String(item.model_name);
    if (item.benchmark_task_name) return String(item.benchmark_task_name);
    return `Model #${index + 1}`;
};

export const ParallelCoordinatesPlot: React.FC<ParallelCoordinatesProps> = ({
    data,
    benchmarkName,
    compact = false
}) => {
    const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);
    const availableMetrics = getAvailableMetrics(data);

    // Defaults
    const defaultMetrics = isMatBench ?
        availableMetrics.filter(m => ['f1_score', 'F1', 'daf', 'DAF', 'accuracy', 'Accuracy', 'precision', 'Precision', 'recall', 'Recall'].includes(m)).slice(0, 5) :
        availableMetrics.slice(0, 5);

    const [selectedMetrics, setSelectedMetrics] = useState(defaultMetrics);
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    const maxModels = 10; // Can show more lines than radar
    const initialMetricsCount = 12;

    // Sort metrics
    const sortedAvailableMetrics = useMemo(() => {
        const unselected = availableMetrics.filter(m => !selectedMetrics.includes(m)).sort((a, b) => a.localeCompare(b));
        const validSelected = selectedMetrics.filter(m => availableMetrics.includes(m));
        return [...validSelected, ...unselected];
    }, [availableMetrics, selectedMetrics]);

    // Valid Data
    const validData = useMemo(() => {
        if (!selectedMetrics.length) return [];
        // Only include items that have data for at least one selected metric
        return data.filter(item => selectedMetrics.some(m => getNumericValue(item[m]) !== null));
    }, [data, selectedMetrics]);

    const limitedData = useMemo(() => validData.slice(0, maxModels), [validData, maxModels]);

    // Transform Data for Parallel Coordinates (Line Chart)
    // X-Axis = Metrics (categorical)
    // Lines = Models
    // To do this in Recharts LineChart, we need an array of objects where each object represents an X-axis point (a metric)
    // and contains values for every line (every model).
    // e.g. [ { name: "F1", model1: 80, model2: 90 }, { name: "DAF", model1: 40, model2: 60 } ]

    const chartData = useMemo(() => {
        if (!selectedMetrics.length) return [];

        // 1. Calculate ranges for normalization per metric (Memoized outside to be accessible if needed, but calculating here for now)
        const metricRanges: Record<string, { vals: number[], min: number, max: number }> = {};
        selectedMetrics.forEach(m => {
            const vals = validData.map(d => getNumericValue(d[m])).filter(v => v !== null) as number[];
            metricRanges[m] = {
                vals,
                min: Math.min(...vals),
                max: Math.max(...vals)
            };
        });

        // 2. Build the array of "Metric Points"
        return selectedMetrics.map(metric => {
            const info = MATBENCH_METRICS[metric];
            const range = metricRanges[metric];
            const point: Record<string, any> = {
                metricKey: metric,
                metricLabel: info?.name || metric,
                betterIs: info?.betterIs || 'higher',
                min: range.min,
                max: range.max,
            };

            limitedData.forEach((modelItem, idx) => {
                const rawVal = getNumericValue(modelItem[metric]);
                if (rawVal !== null) {
                    // Store normalized value for plotting
                    point[`model_${idx}`] = normalizeValue(rawVal, metric, metricRanges[metric]?.vals || []);
                    // Store raw value for tooltip
                    point[`raw_model_${idx}`] = rawVal;
                }
            });

            return point;
        });
    }, [selectedMetrics, limitedData, validData]);

    const chartConfig: ChartConfig = useMemo(() => {
        const config: ChartConfig = {};
        limitedData.forEach((item, idx) => {
            const name = getModelName(item, idx);
            const colorIdx = stringToColorIndex(name, MODEL_COLORS.length);
            config[`model_${idx}`] = {
                label: name,
                color: MODEL_COLORS[colorIdx]
            };
        });
        return config;
    }, [limitedData]);

    const handleMetricToggle = (metric: string) => {
        setSelectedMetrics(prev => prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]);
    };

    if (availableMetrics.length < 2) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Need at least 2 metrics for parallel coordinates</p>
            </div>
        );
    }

    return (
        <div className={compact ? "flex flex-col h-full" : "space-y-4"}>
            {/* Metric Selector (Copy of RadarChart selector essentially) */}
            <div className={`${compact ? 'space-y-3 flex-shrink-0' : 'space-y-4'}`}>
                <div>
                    <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-2 block`}>
                        Metrics Axes:
                    </label>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {sortedAvailableMetrics.slice(0, showAllMetrics ? undefined : initialMetricsCount).map(metric => {
                            const isSelected = selectedMetrics.includes(metric);
                            return (
                                <Badge
                                    key={metric}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`cursor-pointer transition-all hover:scale-105 ${compact ? 'text-xs py-0.5 px-1.5' : ''}`}
                                    onClick={() => handleMetricToggle(metric)}
                                >
                                    {MATBENCH_METRICS[metric]?.name || metric}
                                </Badge>
                            );
                        })}
                        {availableMetrics.length > initialMetricsCount && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => setShowAllMetrics(!showAllMetrics)}
                            >
                                {showAllMetrics ? (
                                    <span className="flex items-center gap-1">Show fewer <ChevronUp className="h-3 w-3" /></span>
                                ) : (
                                    <span className="flex items-center gap-1">Show {availableMetrics.length - initialMetricsCount} more <ChevronDown className="h-3 w-3" /></span>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Parallel Coords Chart */}
            {selectedMetrics.length > 0 && (
                <ChartContainer config={chartConfig} className={compact ? "flex-1 min-h-0" : "h-96 w-full"}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} />
                        <XAxis
                            dataKey="metricLabel"
                            padding={{ left: 30, right: 30 }}
                            tick={({ x, y, payload }: { x: number, y: number, payload: any }) => {
                                // Find the data point corresponding to this tick
                                const metricData = chartData[payload.index];
                                if (!metricData) return <g />;

                                const isLowerBetter = metricData.betterIs === 'lower';
                                const arrow = isLowerBetter ? '↓' : '↑';

                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor" className="text-xs font-medium">
                                            {payload.value} {arrow}
                                        </text>
                                        <title>{isLowerBetter ? "Lower values are better" : "Higher values are better"}</title>
                                    </g>
                                );
                            }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            hide={true} // Hide Y-axis numbers since they are just % now
                        // label={{ value: 'Normalized Performance Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />

                        {/* Tooltip needs to resolve raw values manually since they are in different keys */}
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;

                                // Find the metric data object for this X point
                                // payload[0].payload is the chartData item (the metric point)
                                const pointData = payload[0].payload;

                                return (
                                    <div className="rounded-lg border bg-background p-3 shadow-md max-w-xs">
                                        <div className="font-medium mb-2 border-b pb-1">
                                            {label}
                                        </div>
                                        <div className="space-y-1 text-sm max-h-60 overflow-y-auto">
                                            {limitedData.map((model, idx) => {
                                                const key = `model_${idx}`;
                                                const rawKey = `raw_model_${idx}`;
                                                const rawVal = pointData[rawKey];
                                                const normVal = pointData[key];

                                                // Only show if this model has a value for this metric
                                                if (normVal === undefined) return null;

                                                const modelName = getModelName(model, idx);
                                                const colorIdx = stringToColorIndex(modelName, MODEL_COLORS.length);
                                                const color = MODEL_COLORS[colorIdx];

                                                return (
                                                    <div key={key} className="flex justify-between gap-4 items-center">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></div>
                                                            <span className="truncate" title={modelName}>{modelName}</span>
                                                        </div>
                                                        <span className="font-mono">{formatMetricValue(rawVal, pointData.metricKey)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Legend wrapperStyle={{ paddingTop: '10px' }} />

                        {limitedData.map((item, idx) => {
                            const key = `model_${idx}`;
                            const modelName = getModelName(item, idx);
                            const colorIdx = stringToColorIndex(modelName, MODEL_COLORS.length);

                            return (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={MODEL_COLORS[colorIdx]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    name={modelName}
                                    connectNulls
                                />
                            );
                        })}
                    </LineChart>
                </ChartContainer>
            )}

            <div className="space-y-1">
                <div className="text-xs text-muted-foreground text-center">
                    Parallel Coordinates: Each vertical axis represents the absolute range of that metric in the dataset. <br />
                    Lines crossing (forming an X) between two axes indicate a trade-off (e.g. Model A is high cost but high accuracy).
                </div>
            </div>
        </div>
    );
};
