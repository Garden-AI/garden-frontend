import React, { useState, useEffect, useMemo } from 'react';
import { RowSelectionState } from "@tanstack/react-table";
import { BenchmarksTable } from '../benchmarks-table/BenchmarksTable';
import { ScatterPlot } from './ScatterPlot';
import { RadarChartComponent } from './RadarChart';
import { BarChartComponent } from './BarChart';
import { ParallelCoordinatesPlot } from './ParallelCoordinatesPlot';
import { VisualizationSelector, type VisualizationType } from './VisualizationSelector';
import { Button } from '@/components/shadcn/button';
import { Columns2, Columns } from 'lucide-react';
import { cn } from '@/utils/form.utils';

interface TaskVisualizationProps {
  data: Record<string, unknown>[];
  benchmarkName?: string;
}

export const TaskVisualization: React.FC<TaskVisualizationProps> = ({
  data,
  benchmarkName
}) => {
  const [primaryVisualization, setPrimaryVisualization] = useState<VisualizationType>('scatter');
  const [secondaryVisualization, setSecondaryVisualization] = useState<VisualizationType>('radar');
  const [showDualView, setShowDualView] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Filter data based on selection for visualizations
  // If rows are selected, we only show those. Otherwise we show all (and let charts apply their own limits like top 5)
  const isSelectionActive = Object.keys(rowSelection).length > 0;

  const chartData = useMemo(() => {
    if (!isSelectionActive) return data;
    return data.filter((_, index) => rowSelection[index]);
  }, [data, rowSelection, isSelectionActive]);

  // Check screen size and set dual view default only on first load
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsLargeScreen = window.innerWidth >= 1280; // xl breakpoint
      setIsLargeScreen(newIsLargeScreen);

      // Enable dual view by default on large screens, but only on first initialization
      if (!hasInitialized && newIsLargeScreen) {
        setShowDualView(true);
        setHasInitialized(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [hasInitialized]);

  // Auto-disable dual view on smaller screens (but don't auto-enable)
  useEffect(() => {
    if (!isLargeScreen && showDualView) {
      setShowDualView(false);
    }
  }, [isLargeScreen, showDualView]);

  const renderVisualization = (type: VisualizationType, isCompact = false) => {
    switch (type) {
      case 'scatter':
        return <ScatterPlot data={chartData} benchmarkName={benchmarkName} compact={isCompact} />;
      case 'radar':
        // If selection is active, we override the default limit to show exactly what's selected
        return <RadarChartComponent
          data={chartData}
          benchmarkName={benchmarkName}
          compact={isCompact}
          overrideLimit={isSelectionActive}
        />;
      case 'bar':
        return <BarChartComponent
          data={chartData}
          benchmarkName={benchmarkName}
          compact={isCompact}
        />;
      case 'parallel':
        return <ParallelCoordinatesPlot
          data={chartData}
          benchmarkName={benchmarkName}
          compact={isCompact}
        />;
      case 'table':
      default:
        return <BenchmarksTable
          data={data}
          benchmarkName={benchmarkName}
          compact={isCompact}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />;
    }
  };

  // For single view mode, use primary visualization
  const singleVisualization = showDualView ? primaryVisualization : primaryVisualization;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Dual View Toggle (only show on large screens) */}
        {isLargeScreen && (
          <div className="flex items-center gap-2">
            <Button
              variant={showDualView ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDualView(!showDualView)}
              className="flex items-center gap-1.5"
            >
              {showDualView ? <Columns2 className="h-4 w-4" /> : <Columns className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {showDualView ? 'Dual View' : 'Single View'}
              </span>
            </Button>
            {showDualView && (
              <span className="text-xs text-muted-foreground">
                Compare visualizations side-by-side
              </span>
            )}
          </div>
        )}

        {/* Visualization Selectors */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          {showDualView && isLargeScreen ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Left:</span>
                <VisualizationSelector
                  selectedType={primaryVisualization}
                  onTypeChange={setPrimaryVisualization}
                  className="scale-90"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Right:</span>
                <VisualizationSelector
                  selectedType={secondaryVisualization}
                  onTypeChange={setSecondaryVisualization}
                  className="scale-90"
                />
              </div>
            </>
          ) : (
            <VisualizationSelector
              selectedType={singleVisualization}
              onTypeChange={setPrimaryVisualization}
            />
          )}
        </div>
      </div>

      {/* Visualization Content */}
      <div className="min-h-[200px]">
        {showDualView && isLargeScreen ? (
          // Dual view layout
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground text-center">
                {primaryVisualization.charAt(0).toUpperCase() + primaryVisualization.slice(1)} View
              </h4>
              <div className="border rounded-lg p-3 h-[500px] flex flex-col">
                {renderVisualization(primaryVisualization, true)}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground text-center">
                {secondaryVisualization.charAt(0).toUpperCase() + secondaryVisualization.slice(1)} View
              </h4>
              <div className="border rounded-lg p-3 h-[500px] flex flex-col">
                {renderVisualization(secondaryVisualization, true)}
              </div>
            </div>
          </div>
        ) : (
          // Single view layout
          renderVisualization(singleVisualization)
        )}
      </div>

      {/* Helpful hint for smaller screens */}
      {!isLargeScreen && (
        <div className="text-xs text-muted-foreground text-center">
          💡 Use a larger screen (1280px+) to enable dual-view mode
        </div>
      )}
    </div>
  );
};