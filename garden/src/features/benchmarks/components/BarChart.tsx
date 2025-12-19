import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig
} from '@/components/shadcn/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select';
import {
    MATBENCH_METRICS,
    getPerformanceTier,
    isMatBenchDiscovery,
    hasMatBenchMetrics
} from '../utils/matbench';
import {
    getNumericValue,
    getAvailableMetrics,
    getModelName,
    getModelColor
} from '../utils/charts';
import { formatMetricValue } from '../utils/formatting';

interface BarChartProps {
    data: Record<string, unknown>[];
    benchmarkName?: string;
    compact?: boolean;
}

// Generate colors based on performance tier
const getBarColor = (item: any, metric: string, isMatBench: boolean): string => {
    // If it's a matbench dataset and we are looking at F1 or DAF, we can color code by tier
    // Otherwise usage default primary color
    if (!isMatBench) return 'hsl(var(--primary))';

    // Only color code if we are looking at primary metrics or if we have enough info
    const f1Score = getNumericValue(item.f1_score) || getNumericValue(item.F1);
    const daf = getNumericValue(item.daf) || getNumericValue(item.DAF);

    if (f1Score !== null && daf !== null) {
        const tier = getPerformanceTier(f1Score, daf);
        switch (tier.tier) {
            case 'excellent': return '#16a34a'; // green-600
            case 'good': return '#2563eb'; // blue-600
            case 'fair': return '#ca8a04'; // yellow-600
            case 'poor': return '#dc2626'; // red-600
            default: return 'hsl(var(--primary))';
        }
    }

    // Fallback for simple single-metric view if we don't have pair info
    return 'hsl(var(--primary))';
};

export const BarChartComponent: React.FC<BarChartProps> = ({ data, benchmarkName, compact = false }) => {
    const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);
    const availableMetrics = getAvailableMetrics(data);
    const navigate = useNavigate();

    const handleModelClick = (item: any) => {
        if (item.garden_doi) {
            navigate(`/garden/${item.garden_doi}`);
        }
    };

    // Default to F1 or first metric
    const defaultMetric = isMatBench ?
        (availableMetrics.find(m => ['f1_score', 'F1'].includes(m)) || availableMetrics[0]) :
        availableMetrics[0];

    const [metric, setMetric] = React.useState(defaultMetric || '');

    // Prepare data
    const chartData = useMemo(() => {
        if (!metric) return [];

        return data.map((item, index) => {
            const val = getNumericValue(item[metric]);
            if (val === null) return null;

            return {
                name: getModelName(item, index),
                value: val,
                garden_doi: (item as any).garden_doi as string | undefined, // Explicitly pass garden_doi
                ...item
            };
        }).filter(Boolean)
            .sort((a, b) => {
                // Sort by value (descending for most metrics, ascending for error metrics)
                const metricInfo = MATBENCH_METRICS[metric];
                const multiplier = metricInfo?.betterIs === 'lower' ? 1 : -1;
                return (a!.value - b!.value) * multiplier;
            })
            // Limit to top 20 for readability if not compact, or top 10 if compact
            .slice(0, compact ? 10 : 20);
    }, [data, metric, compact]);

    const chartConfig: ChartConfig = {
        value: {
            label: MATBENCH_METRICS[metric]?.name || metric,
            color: "hsl(var(--primary))",
        },
    };

    if (availableMetrics.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>No numeric metrics available for bar chart</p>
            </div>
        );
    }

    return (
        <div className={compact ? "flex flex-col h-full" : "space-y-4"}>
            <div className={`${compact ? 'space-y-3 flex-shrink-0' : 'space-y-4'}`}>
                <div className="flex items-center gap-2">
                    <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground whitespace-nowrap`}>
                        Metric:
                    </label>
                    <Select value={metric} onValueChange={setMetric}>
                        <SelectTrigger className={compact ? "w-32 h-8 text-xs" : "w-48"}>
                            <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableMetrics.map(m => (
                                <SelectItem key={m} value={m}>
                                    {MATBENCH_METRICS[m]?.name || m}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <ChartContainer config={chartConfig} className={compact ? "flex-1 min-h-0" : "h-96 w-full"}>
                <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 100, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                        type="number"
                        tickFormatter={(val) => formatMetricValue(val, metric)}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        tick={({ x, y, payload }) => {
                            // Find the original item to check for garden_doi
                            const item = chartData[payload.index];
                            const isClickable = item && item.garden_doi;

                            return (
                                <g transform={`translate(${x},${y})`}>
                                    <text
                                        x={0}
                                        y={0}
                                        dy={4}
                                        textAnchor="end"
                                        fill="currentColor"
                                        className={`text-[11px] ${isClickable ? 'fill-primary font-medium hover:underline cursor-pointer' : 'fill-muted-foreground'}`}
                                        onClick={() => isClickable && handleModelClick(item)}
                                    >
                                        {payload.value && String(payload.value).length > 20
                                            ? String(payload.value).substring(0, 20) + '...'
                                            : payload.value}
                                        {isClickable && <title>Click to view Garden</title>}
                                    </text>
                                </g>
                            );
                        }}
                        interval={0}
                    />
                    <ChartTooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;

                            const data = payload[0].payload as any;
                            return (
                                <div className="rounded-lg border bg-background p-3 shadow-md">
                                    <div className="font-medium mb-2">
                                        {data.name}
                                        {data.garden_doi && (
                                            <span className="ml-2 text-[10px] text-blue-500 font-normal border border-blue-200 bg-blue-50 px-1 rounded">
                                                Clickable
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">{MATBENCH_METRICS[metric]?.name || metric}:</span>
                                        <span className="font-mono">{formatMetricValue(data.value, metric)}</span>
                                    </div>
                                    {data.garden_doi && (
                                        <div className="mt-2 text-[10px] text-muted-foreground italic">
                                            Click bar or label to view Garden
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getBarColor(entry, metric, isMatBench)}
                                className={(entry as any).garden_doi ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
                                onClick={() => handleModelClick(entry)}
                            />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ChartContainer>

            {!compact && isMatBench && (
                <div className="text-xs text-muted-foreground text-center">
                    Colors indicate performance tiers based on F1/DAF (Green: Excellent, Blue: Good, Yellow: Fair, Red: Poor).
                    Gray indicates insufficient data for tiering.
                </div>
            )}
        </div>
    );
};
