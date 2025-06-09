import React, { useState } from 'react';
import { BarChart3, ScatterChart as Scatter, RadarIcon as Radar, Table } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/utils/form.utils';

export type VisualizationType = 'table' | 'scatter' | 'radar';

interface VisualizationSelectorProps {
  selectedType: VisualizationType;
  onTypeChange: (type: VisualizationType) => void;
  className?: string;
}

const visualizationOptions = [
  {
    type: 'table' as const,
    label: 'Table',
    icon: Table,
    description: 'Detailed data table view'
  },
  {
    type: 'scatter' as const,
    label: 'Scatter Plot',
    icon: Scatter,
    description: 'Compare two metrics'
  },
  {
    type: 'radar' as const,
    label: 'Radar Chart',
    icon: Radar,
    description: 'Multi-metric comparison'
  }
];

export const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({
  selectedType,
  onTypeChange,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-muted rounded-lg", className)}>
      {visualizationOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedType === option.type;
        
        return (
          <Button
            key={option.type}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            onClick={() => onTypeChange(option.type)}
            className={cn(
              "flex items-center gap-1.5 transition-all",
              isSelected 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            title={option.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
};