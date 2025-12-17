import React from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/shadcn/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/tooltip';
import {
  MATBENCH_METRICS,
  getPerformanceTier,
  getPracticalImpact
} from '../utils/matbench';
import { MetricInfo } from '../types/benchmarks.types';
import { formatMetricValue } from '../utils/formatting';

interface MetricDisplayProps {
  metricKey: string;
  value: unknown;
  f1Score?: number;
  daf?: number;
  showTier?: boolean;
  showImpact?: boolean;
  compact?: boolean;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  metricKey,
  value,
  f1Score,
  daf,
  showTier = false,
  showImpact = false,
  compact = false,
}) => {
  const metric = MATBENCH_METRICS[metricKey];

  if (!metric) {
    return <span>{String(value)}</span>;
  }

  const formattedValue = formatMetricValue(value, metricKey);
  const performanceTier = showTier ? getPerformanceTier(f1Score, daf) : null;
  const impact = showImpact ? getPracticalImpact(f1Score, daf) : null;

  const TrendIcon = metric.betterIs === 'higher' ? TrendingUp : TrendingDown;
  const trendColor = metric.betterIs === 'higher' ? 'text-green-600' : 'text-red-600';

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium cursor-help">
              {formattedValue}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[min(90vw,24rem)]">
            <div className="flex flex-col gap-1">
              <div className="font-medium flex items-center gap-1 flex-wrap">
                {metric.name}
                {metric.unit && <span className="text-muted-foreground ml-1 font-normal">({metric.unit})</span>}
                <TrendIcon className={`h-3 w-3 ${trendColor} flex-shrink-0`} />
              </div>
              <p className="text-xs text-muted-foreground whitespace-normal break-words leading-relaxed">
                {metric.description}
              </p>
              {metric.betterIs && (
                <p className="text-xs font-medium">
                  {metric.betterIs === 'higher' ? 'Higher is better' : 'Lower is better'}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {formattedValue}
        </span>

        {metric.isPrimaryMetric && (
          <Badge variant="secondary" className="text-xs">
            Key Metric
          </Badge>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[min(90vw,24rem)]">
              <div className="flex flex-col gap-1">
                <div className="font-medium flex items-center gap-1 flex-wrap">
                  {metric.name}
                  {metric.unit && <span className="text-muted-foreground ml-1 font-normal">({metric.unit})</span>}
                  <TrendIcon className={`h-3 w-3 ${trendColor} flex-shrink-0`} />
                </div>
                <p className="text-xs text-muted-foreground whitespace-normal break-words leading-relaxed">
                  {metric.description}
                </p>
                <p className="text-xs font-medium">
                  {metric.betterIs === 'higher' ? 'Better is higher' : 'Better is lower'}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {performanceTier && (
        <Badge
          variant="outline"
          className={`text-xs ${performanceTier.color}`}
        >
          {performanceTier.description}
        </Badge>
      )}

      {impact && (
        <p className="text-xs text-muted-foreground italic">
          {impact}
        </p>
      )}
    </div>
  );
};

interface MetricHeaderProps {
  metricKey: string;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}

export const MetricHeader: React.FC<MetricHeaderProps> = ({
  metricKey,
  sortable = true,
  onSort,
  sortDirection,
}) => {
  const metric = MATBENCH_METRICS[metricKey];

  if (!metric) {
    return <span>{metricKey}</span>;
  }

  const TrendIcon = metric.betterIs === 'higher' ? TrendingUp : TrendingDown;
  const trendColor = metric.betterIs === 'higher' ? 'text-green-600' : 'text-red-600';

  const content = (
    <div className="flex items-center gap-1">
      <span className={metric.isPrimaryMetric ? 'font-semibold' : ''}>
        {metric?.name || metricKey}
      </span>
      <TrendIcon className={`h-3 w-3 ${trendColor}`} />

    </div>
  );

  if (!sortable) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onSort}
            className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
          >
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[min(90vw,24rem)]">
          <div className="flex flex-col gap-1">
            <div className="font-medium flex items-center gap-1 flex-wrap">
              {metric.name}
              <TrendIcon className={`h-3 w-3 ${trendColor} flex-shrink-0`} />
            </div>
            <p className="text-xs text-muted-foreground whitespace-normal break-words leading-relaxed">
              {metric.description}
            </p>
            <p className="text-xs font-medium">
              {metric.betterIs === 'higher' ? 'Higher is better' : 'Lower is better'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};