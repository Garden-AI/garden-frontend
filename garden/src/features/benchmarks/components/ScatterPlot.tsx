import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScatterChart,
  Scatter,
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
  getModelName
} from '../utils/charts';
import { formatMetricValue } from '../utils/formatting';

interface ScatterPlotProps {
  data: Record<string, unknown>[];
  benchmarkName?: string;
  compact?: boolean;
}

// Generate colors based on performance tier for MatBench data
const getPointColor = (point: any, isMatBench: boolean): string => {
  if (!isMatBench) return 'hsl(var(--primary))';

  const f1Score = getNumericValue(point.f1_score) || getNumericValue(point.F1);
  const daf = getNumericValue(point.daf) || getNumericValue(point.DAF);

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

  return 'hsl(var(--primary))';
};

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, benchmarkName, compact = false }) => {
  const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);
  const availableMetrics = getAvailableMetrics(data);
  const navigate = useNavigate();

  const handleModelClick = (item: any) => {
    if (item.garden_doi) {
      navigate(`/garden/${item.garden_doi}`);
    }
  };

  // Default to F1 vs DAF for MatBench, or first two metrics for others
  const defaultXMetric = isMatBench ?
    (availableMetrics.find(m => ['f1_score', 'F1'].includes(m)) || availableMetrics[0]) :
    availableMetrics[0];
  const defaultYMetric = isMatBench ?
    (availableMetrics.find(m => ['daf', 'DAF'].includes(m)) || availableMetrics[1]) :
    availableMetrics[1];

  const [xMetric, setXMetric] = React.useState(defaultXMetric || '');
  const [yMetric, setYMetric] = React.useState(defaultYMetric || '');

  // Process data for the scatter plot
  const scatterData = useMemo(() => {
    if (!xMetric || !yMetric) return [];

    return data.map((item, index) => {
      const xValue = getNumericValue(item[xMetric]);
      const yValue = getNumericValue(item[yMetric]);

      if (xValue === null || yValue === null) return null;

      return {
        x: xValue,
        y: yValue,
        modelName: getModelName(item, index),
        garden_doi: (item as any).garden_doi,
        ...item, // Include all original data for tooltip
      };
    }).filter(Boolean);
  }, [data, xMetric, yMetric]);

  const chartConfig: ChartConfig = {
    x: {
      label: MATBENCH_METRICS[xMetric]?.name || xMetric,
    },
    y: {
      label: MATBENCH_METRICS[yMetric]?.name || yMetric,
    },
  };

  if (availableMetrics.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Need at least 2 metrics for scatter plot visualization</p>
      </div>
    );
  }

  return (
    <div className={compact ? "flex flex-col h-full" : "space-y-4"}>
      {/* Metric Selectors */}
      <div className={`flex ${compact ? 'flex-col gap-2 flex-shrink-0' : 'flex-wrap gap-4'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground whitespace-nowrap`}>
            X-Axis:
          </label>
          <Select value={xMetric} onValueChange={setXMetric}>
            <SelectTrigger className={compact ? "w-32 h-8 text-xs" : "w-40"}>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {availableMetrics.map(metric => (
                <SelectItem key={metric} value={metric}>
                  {MATBENCH_METRICS[metric]?.name || metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground whitespace-nowrap`}>
            Y-Axis:
          </label>
          <Select value={yMetric} onValueChange={setYMetric}>
            <SelectTrigger className={compact ? "w-32 h-8 text-xs" : "w-40"}>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {availableMetrics.map(metric => (
                <SelectItem key={metric} value={metric}>
                  {MATBENCH_METRICS[metric]?.name || metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scatter Plot */}
      <ChartContainer config={chartConfig} className={compact ? "flex-1 min-h-0" : "h-80 w-full"}>
        <ScatterChart data={scatterData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name={String(chartConfig.x.label)}
            tickFormatter={(value) => formatMetricValue(value, xMetric)}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={String(chartConfig.y.label)}
            tickFormatter={(value) => formatMetricValue(value, yMetric)}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const data = payload[0].payload as any; // Cast payload to any
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    {data.modelName}
                    {data.garden_doi && (
                      <span className="text-[10px] text-blue-500 font-normal border border-blue-200 bg-blue-50 px-1 rounded">
                        View Garden
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{xMetric}:</span>
                      <span className="font-mono">{formatMetricValue(data.x, xMetric)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{yMetric}:</span>
                      <span className="font-mono">{formatMetricValue(data.y, yMetric)}</span>
                    </div>
                    {isMatBench && (
                      <div className="pt-1 border-t">
                        <span className="text-xs text-muted-foreground">
                          Performance: {getPerformanceTier(
                            getNumericValue(data.f1_score) || getNumericValue(data.F1) || 0,
                            getNumericValue(data.daf) || getNumericValue(data.DAF) || 0
                          ).description}
                        </span>
                      </div>
                    )}
                    {data.garden_doi && (
                      <div className="mt-1 text-[10px] text-muted-foreground italic">
                        Click point to view
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
          <Scatter
            dataKey="y"
            fill="hsl(var(--primary))"
          >
            {scatterData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getPointColor(entry, isMatBench)}
                className={(entry as any).garden_doi ? "cursor-pointer hover:opacity-80" : ""}
                onClick={() => handleModelClick(entry)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>

      <div className="space-y-1">
        {isMatBench && (
          <div className="text-xs text-muted-foreground text-center">
            Colors indicate performance tiers:
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full ml-2 mr-1"></span>Excellent
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2 mr-1"></span>Good
            <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full ml-2 mr-1"></span>Fair
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full ml-2 mr-1"></span>Poor
          </div>
        )}
      </div>
    </div>
  );
};