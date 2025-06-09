import React, { useMemo } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from '@/components/shadcn/chart';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Badge } from '@/components/shadcn/badge';
import { 
  MATBENCH_METRICS, 
  formatMetricValue,
  getPerformanceTier,
  isMatBenchDiscovery,
  hasMatBenchMetrics
} from '../utils/matbench';
import { useGetModalFunction } from '@/features/modal/api/useGetModalFunction';
import { useNavigate } from 'react-router-dom';

interface RadarChartProps {
  data: Record<string, unknown>[];
  benchmarkName?: string;
  compact?: boolean;
}

// Helper function to extract numeric value
const getNumericValue = (value: unknown): number | null => {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'parsedValue' in value) {
    const parsedValue = (value as { parsedValue: unknown }).parsedValue;
    return typeof parsedValue === 'number' ? parsedValue : null;
  }
  return null;
};

// Get available numeric metrics
const getAvailableMetrics = (data: Record<string, unknown>[]): string[] => {
  if (!data.length) return [];
  
  const numericKeys = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'function_id' && key !== 'date_invoked') {
        const value = getNumericValue(item[key]);
        if (value !== null) {
          numericKeys.add(key);
        }
      }
    });
  });
  
  return Array.from(numericKeys).sort();
};

// Normalize values to 0-100 scale for radar chart
const normalizeValue = (value: number, metric: string, allValues: number[]): number => {
  const metricInfo = MATBENCH_METRICS[metric];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  
  if (min === max) return 50; // If all values are the same
  
  let normalized;
  if (metricInfo?.betterIs === 'lower') {
    // For "lower is better" metrics, invert the scale
    normalized = ((max - value) / (max - min)) * 100;
  } else {
    // For "higher is better" metrics
    normalized = ((value - min) / (max - min)) * 100;
  }
  
  return Math.round(normalized);
};

// Generate colors for different functions
const FUNCTION_COLORS = [
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#16a34a', // green-600
  '#ca8a04', // yellow-600
  '#9333ea', // purple-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#c2410c', // orange-700
];

// Component to display function name from ID
const FunctionName: React.FC<{ functionId: string | number }> = ({ functionId }) => {
  const { data } = useGetModalFunction(String(functionId));
  return <span>{data?.title || data?.function_name || `Function #${functionId}`}</span>;
};

export const RadarChartComponent: React.FC<RadarChartProps> = ({ data, benchmarkName, compact = false }) => {
  const navigate = useNavigate();
  const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);
  const availableMetrics = getAvailableMetrics(data);
  
  // Default metrics - prioritize key MatBench metrics
  const defaultMetrics = isMatBench ? 
    availableMetrics.filter(m => ['f1_score', 'F1', 'daf', 'DAF', 'accuracy', 'Accuracy', 'precision', 'Precision', 'recall', 'Recall'].includes(m)).slice(0, 5) :
    availableMetrics.slice(0, 5);
  
  const [selectedMetrics, setSelectedMetrics] = React.useState(defaultMetrics);
  const [maxFunctions, setMaxFunctions] = React.useState(5);
  
  // Process data for radar chart
  const radarData = useMemo(() => {
    if (!selectedMetrics.length) return [];
    
    // Get all values for each metric for normalization
    const metricValues: Record<string, number[]> = {};
    selectedMetrics.forEach(metric => {
      metricValues[metric] = data.map(item => getNumericValue(item[metric])).filter(v => v !== null) as number[];
    });
    
    // Create radar data structure
    return selectedMetrics.map(metric => {
      const radarPoint: any = {
        metric: metric,
        fullName: metric,
      };
      
      // Add data for each function (limited by maxFunctions)
      data.slice(0, maxFunctions).forEach((item, index) => {
        const value = getNumericValue(item[metric]);
        if (value !== null) {
          radarPoint[`function_${item.function_id}`] = normalizeValue(value, metric, metricValues[metric]);
        }
      });
      
      return radarPoint;
    });
  }, [data, selectedMetrics, maxFunctions]);
  
  // Hook to get function data for chart config
  const functionQueries = data.slice(0, maxFunctions).map(item => 
    useGetModalFunction(String(item.function_id))
  );

  // Generate chart config
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.slice(0, maxFunctions).forEach((item, index) => {
      const functionData = functionQueries[index]?.data;
      const functionName = functionData?.title || functionData?.function_name || `Function #${item.function_id}`;
      
      config[`function_${item.function_id}`] = {
        label: functionName,
        color: FUNCTION_COLORS[index % FUNCTION_COLORS.length],
      };
    });
    return config;
  }, [data, maxFunctions, functionQueries]);
  
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
        {/* Function Limit Selector */}
        <div className="flex items-center gap-2">
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground whitespace-nowrap`}>
            Show Functions:
          </label>
          <Select value={maxFunctions.toString()} onValueChange={(v) => setMaxFunctions(parseInt(v))}>
            <SelectTrigger className={compact ? "w-16 h-8 text-xs" : "w-24"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(compact ? [3, 4, 5] : [3, 4, 5, 6, 7, 8]).map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!compact && (
            <span className="text-xs text-muted-foreground">
              (Top {maxFunctions} functions)
            </span>
          )}
        </div>
        
        {/* Metric Selectors */}
        <div>
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-2 block`}>
            Metrics to Compare:
          </label>
          <div className="flex flex-wrap gap-1">
            {availableMetrics.map(metric => {
              const isSelected = selectedMetrics.includes(metric);
              
              return (
                <Badge
                  key={metric}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${compact ? 'text-xs py-0.5 px-1.5' : ''}`}
                  onClick={() => handleMetricToggle(metric)}
                >
                  {metric}
                </Badge>
              );
            })}
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
              dataKey="metric" 
              tick={{ fontSize: 12 }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10 }}
              tickCount={6}
            />
            
            {/* Render a radar area for each function */}
            {data.slice(0, maxFunctions).map((item, index) => {
              const key = `function_${item.function_id}`;
              const color = FUNCTION_COLORS[index % FUNCTION_COLORS.length];
              const functionName = String(chartConfig[key]?.label || `Function #${item.function_id}`);
              
              return (
                <Radar
                  key={key}
                  name={functionName}
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.1}
                  strokeWidth={2}
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
                    const functionId = entry.dataKey?.replace('function_', '');
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                        onClick={() => {
                          if (functionId) {
                            navigate(`/modal-functions/${functionId}`);
                          }
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-foreground hover:text-primary">
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
          Values are normalized to 0-100 scale for comparison. Higher values indicate better performance.
        </div>
        <div className="text-xs text-muted-foreground text-center">
          💡 Click any function name in the legend to view function details
        </div>
      </div>
    </div>
  );
};