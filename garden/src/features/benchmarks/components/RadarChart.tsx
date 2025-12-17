import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig
} from '@/components/shadcn/chart';

import { Badge } from '@/components/shadcn/badge';
import {
  MATBENCH_METRICS,
  isMatBenchDiscovery,
  hasMatBenchMetrics
} from '../utils/matbench';
import {
  getNumericValue,
  getAvailableMetrics,
  getModelName,
  normalizeValue,
  stringToColorIndex
} from '../utils/charts';
import { MODEL_COLORS } from '../utils/constants';

interface RadarChartProps {
  data: Record<string, unknown>[];
  benchmarkName?: string;
  compact?: boolean;
  overrideLimit?: boolean;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ data, benchmarkName, compact = false, overrideLimit = false }) => {
  const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);
  const availableMetrics = getAvailableMetrics(data);
  const navigate = useNavigate();

  const handleModelClick = (item: any) => {
    if (item.garden_doi) {
      navigate(`/garden/${item.garden_doi}`);
    }
  };

  // Default metrics - prioritize key MatBench metrics
  const defaultMetrics = isMatBench ?
    availableMetrics.filter(m => ['f1_score', 'F1', 'daf', 'DAF', 'accuracy', 'Accuracy', 'precision', 'Precision', 'recall', 'Recall'].includes(m)).slice(0, 5) :
    availableMetrics.slice(0, 5);


  const [selectedMetrics, setSelectedMetrics] = React.useState(defaultMetrics);
  const [showAllMetrics, setShowAllMetrics] = React.useState(false);
  const maxModels = 5;
  const initialMetricsCount = 12; // Number of metrics to show by default

  // Sort available metrics: Selected ones first (in selection order), then unselected ones (alphabetical)
  const sortedAvailableMetrics = useMemo(() => {
    // Get unselected metrics sorted alphabetically
    const unselected = availableMetrics
      .filter(m => !selectedMetrics.includes(m))
      .sort((a, b) => a.localeCompare(b));

    // Combine selected (filtering to ensure they exist in availableMetrics) + unselected
    const validSelected = selectedMetrics.filter(m => availableMetrics.includes(m));

    return [...validSelected, ...unselected];
  }, [availableMetrics, selectedMetrics]);

  // Filter data to only include models that have values for the selected metrics
  const validData = useMemo(() => {
    if (!selectedMetrics.length) return [];
    return data.filter(item => {
      // Check if this item has a numeric value for AT LEAST ONE of the selected metrics
      return selectedMetrics.some(metric => getNumericValue(item[metric]) !== null);
    });
  }, [data, selectedMetrics]);

  // Apply limit to valid data
  const limitedData = useMemo(() => overrideLimit ? validData : validData.slice(0, maxModels), [validData, maxModels, overrideLimit]);

  // Process data for radar chart
  const radarData = useMemo(() => {
    if (!selectedMetrics.length) return [];

    // Get all values for each metric for normalization (using ALL valid data to establish range)
    const metricValues: Record<string, number[]> = {};
    selectedMetrics.forEach(metric => {
      metricValues[metric] = validData.map(item => getNumericValue(item[metric])).filter(v => v !== null) as number[];
    });

    // Create radar data structure
    return selectedMetrics.map(metric => {
      const radarPoint: Record<string, unknown> = {
        metric: metric,
        fullName: MATBENCH_METRICS[metric]?.name || metric,
      };

      // Add data for each model (using the limited set)
      limitedData.forEach((item, index) => {
        const value = getNumericValue(item[metric]);
        if (value !== null) {
          radarPoint[`model_${index}`] = normalizeValue(value, metric, metricValues[metric]);
        }
      });

      return radarPoint;
    });
  }, [validData, limitedData, selectedMetrics]);

  // Generate chart config
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    limitedData.forEach((item, index) => {
      const modelName = getModelName(item, index);
      const colorIndex = stringToColorIndex(modelName, MODEL_COLORS.length);
      config[`model_${index}`] = {
        label: modelName,
        color: MODEL_COLORS[colorIndex],
      };
    });
    return config;
  }, [limitedData]);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };


  if (availableMetrics.length < 3) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Need at least 3 metrics for radar chart visualization</p>
      </div>
    );
  }

  return (
    <div className={compact ? "flex flex-col h-full" : "space-y-4"}>
      {/* Controls */}
      <div className={`${compact ? 'space-y-3 flex-shrink-0' : 'space-y-4'}`}>


        {/* Metric Selectors */}
        <div>
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-2 block`}>
            Metrics to Compare:
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
          <div className={`${compact ? 'text-xs' : 'text-xs'} text-muted-foreground mt-1`}>
            Selected: {selectedMetrics.length} metrics
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      {selectedMetrics.length > 0 && (
        <ChartContainer config={chartConfig} className={compact ? "flex-1 min-h-0" : "h-96 w-full"}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="fullName"
              tick={{ fontSize: 12 }}
              className="text-xs"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              tickCount={6}
            />

            {/* Render a radar area for each model */}
            {limitedData.map((item, index) => {
              const key = `model_${index}`;
              const modelName = getModelName(item, index);
              const colorIndex = stringToColorIndex(modelName, MODEL_COLORS.length);
              const color = MODEL_COLORS[colorIndex];

              return (
                <Radar
                  key={key}
                  name={modelName}
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  className={(item as any).garden_doi ? "cursor-pointer hover:opacity-80" : ""}
                  onClick={() => handleModelClick(item)}
                />
              );
            })}

            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <div className="font-medium mb-2">{label}</div>
                    <div className="space-y-1 text-sm">
                      {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between gap-4">
                          <span
                            className="text-muted-foreground flex items-center gap-1"
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name}:
                          </span>
                          <span className="font-mono">{entry.value}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              content={(props) => (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {props.payload?.map((entry, index) => {
                    const item = limitedData[index];
                    const isClickable = item && (item as any).garden_doi;
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-2 py-1 rounded ${isClickable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                        onClick={() => isClickable && handleModelClick(item)}
                        title={isClickable ? "Click to view Garden" : undefined}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className={`text-sm ${isClickable ? 'text-blue-600 hover:underline' : 'text-foreground'}`}>
                          {entry.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            />
          </RadarChart>
        </ChartContainer>
      )}

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground text-center">
          Chart shows normalized relative values (0-100% of range). <br />
          <b>Note:</b> For cost/error metrics, lower values (near center) are better. For accuracy/score metrics, higher values (near edge) are better.
        </div>
      </div>
    </div>
  );
};