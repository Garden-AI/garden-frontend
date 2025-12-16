import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, EyeOff } from "lucide-react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    RowSelectionState,
    useReactTable,
    VisibilityState,
    ColumnResizeMode
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table"
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/shadcn/dropdown-menu";
import { MetricDisplay, MetricHeader } from "../components/MetricDisplay";
import {
    MATBENCH_METRICS,
    formatMetricValue,
    getPerformanceTier,
    isMatBenchDiscovery,
    hasMatBenchMetrics
} from "../utils/matbench";

interface BenchmarksTableProps<TData, TValue> {
    columns?: ColumnDef<TData, TValue>[]
    data: TData[]
    generateColumns?: boolean
    benchmarkName?: string
    compact?: boolean
    rowSelection?: RowSelectionState
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

// Default column sizes
const DEFAULT_COLUMN_SIZE = 80;
const MODEL_COLUMN_SIZE = 200;
const TASK_COLUMN_SIZE = 150;
const DATE_COLUMN_SIZE = 100;

// Helper function to generate a red-yellow-green background color based on value and metric direction
const getColorForValue = (value: number, betterIs: 'higher' | 'lower' = 'higher'): string => {
    let normalizedValue = value;

    // For "lower is better" metrics, we need to invert the color logic
    if (betterIs === 'lower') {
        // For lower-is-better metrics, smaller values should be green
        // We'll map the value to a 0-1 scale where 0 = green (best) and 1 = red (worst)
        if (value <= 0) {
            // Perfect score for lower-is-better (0 or negative) = bright green
            return `rgba(0, 180, 0, 0.4)`;
        } else if (value >= 1) {
            // Very bad score for lower-is-better (1 or higher) = use log scale
            const intensity = Math.min(0.6, 0.3 + Math.log10(value) * 0.15);
            return `rgba(255, 0, 0, ${intensity})`;
        } else {
            // Invert the value so that 0 = 1 (green) and 1 = 0 (red)
            normalizedValue = 1 - value;
        }
    } else {
        // For "higher is better" metrics (original logic)
        if (value > 1) {
            const intensity = Math.min(0.6, 0.3 + Math.log10(value) * 0.15);
            return `rgba(0, 180, 0, ${intensity})`;
        }
        normalizedValue = value;
    }

    // Ensure value is between 0 and 1 for color interpolation
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));

    // Red-Yellow-Green transition
    // For values 0-0.5: red to yellow
    // For values 0.5-1: yellow to green
    let red, green, blue;

    if (clampedValue < 0.5) {
        // Red to Yellow (red stays at 255, green increases)
        red = 255;
        green = Math.round(255 * (clampedValue * 2)); // *2 to reach 255 at value=0.5
        blue = 0;
    } else {
        // Yellow to Green (green stays at 255, red decreases)
        red = Math.round(255 * (1 - (clampedValue - 0.5) * 2)); // *2 to reach 0 at value=1
        green = 255;
        blue = 0;
    }

    // Higher opacity for better visibility
    const opacity = 0.3;

    // Return rgba color with appropriate transparency
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

// Helper function to generate columns from data
export const generateColumnsFromData = <TData extends Record<string, unknown>, TValue>(
    data: TData[],
    benchmarkName?: string
): ColumnDef<TData, TValue>[] => {
    if (!data.length) return [];

    const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);

    // Get all unique keys from all data objects
    const allKeys = new Set<string>();
    // Only exclude true metadata that shouldn't be displayed as columns
    // Include cost/performance metrics for comparison across models
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
        cell: ({ row }) => {
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
        cell: ({ row }) => {
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
            case 'device_type':
                const icon = String(value).toLowerCase() === 'cuda' ? '🎮' :
                    String(value).toLowerCase() === 'mps' ? '🍎' : '💻';
                return <span>{icon} {String(value).toUpperCase()}</span>;
            case 'num_gpus':
                return <span>{numValue} GPU{numValue !== 1 ? 's' : ''}</span>;
            default:
                return numValue.toFixed(3);
        }
    };



    // Create column definitions for other fields
    const dynamic_columns = keys.map(key => ({
        accessorKey: key,
        header: ({ column }) => {
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
        cell: ({ row }) => {
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
                const parsedValue = (value as { parsedValue: number }).parsedValue;
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
};

// Helper function to extract numeric values
const getNumericValue = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return isNaN(value) ? null : value;
    }
    if (value && typeof value === 'object' && 'parsedValue' in value) {
        const parsedValue = (value as { parsedValue: unknown }).parsedValue;
        return typeof parsedValue === 'number' && !isNaN(parsedValue) ? parsedValue : null;
    }
    return null;
};

// Define column metadata type
interface ColumnMeta {
    isMetricColumn?: boolean;
    getNumericValue?: (value: unknown) => number | null;
}

// Helper function to check if a value can be colored (is numeric) and get color direction
const getNumericValueForColoring = (
    value: unknown,
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

export const BenchmarksTable = <TData extends Record<string, unknown>, TValue>({
    columns,
    data,
    benchmarkName,
    compact = false,
    rowSelection,
    setRowSelection,
}: BenchmarksTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

    const finalRowSelection = rowSelection ?? internalRowSelection;
    const finalSetRowSelection = setRowSelection ?? setInternalRowSelection;

    const columnResizeMode: ColumnResizeMode = 'onChange';

    // Determine if this is MatBench data for coloring purposes
    const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);

    // Initial columns
    const baseColumns = useMemo(() =>
        columns || generateColumnsFromData(data, benchmarkName),
        [columns, data, benchmarkName]
    );

    // Add select column
    const tableColumns = useMemo(() => {
        const selectColumn: ColumnDef<TData, TValue> = {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px] border-slate-300 dark:border-slate-600"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px] border-slate-300 dark:border-slate-600"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 60,
        };

        return [selectColumn, ...baseColumns];
    }, [baseColumns]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: finalSetRowSelection,
        enableRowSelection: true,
        columnResizeMode,
        state: {
            sorting,
            columnVisibility,
            rowSelection: finalRowSelection,
        },
    });

    // Get hideable columns for select all/deselect all functionality
    const hideableColumns = table.getAllColumns().filter(column => column.getCanHide());
    const allHideableVisible = hideableColumns.every(column => column.getIsVisible());
    const allHideableHidden = hideableColumns.every(column => !column.getIsVisible());

    const handleSelectAll = () => {
        hideableColumns.forEach(column => {
            column.toggleVisibility(true);
        });
    };

    const handleDeselectAll = () => {
        hideableColumns.forEach(column => {
            column.toggleVisibility(false);
        });
    };

    // Correctly determine column count for empty state
    const columnCount = table.getAllColumns().length;

    return (
        <div className={`${compact ? 'flex flex-col h-full text-sm' : 'space-y-2'}`}>
            <div className={`flex justify-end ${compact ? 'flex-shrink-0' : ''}`}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`ml-auto flex items-center gap-1 ${compact ? 'h-7 px-2 text-xs' : ''}`}
                        >
                            <EyeOff className={compact ? "h-3 w-3" : "h-4 w-4"} />
                            <span className={compact ? "hidden" : ""}>Columns</span>
                            <ChevronDown className={compact ? "h-3 w-3" : "h-4 w-4"} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                handleSelectAll();
                            }}
                            disabled={allHideableVisible}
                            className="flex items-center gap-2"
                        >
                            <Checkbox checked={allHideableVisible} disabled />
                            <span>Select All</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                handleDeselectAll();
                            }}
                            disabled={allHideableHidden}
                            className="flex items-center gap-2"
                        >
                            <Checkbox checked={!allHideableHidden} disabled />
                            <span>Deselect All</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {hideableColumns.map(column => {
                            return (
                                <DropdownMenuItem
                                    key={column.id}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        column.toggleVisibility();
                                    }}
                                    className="flex items-center gap-2 capitalize"
                                >
                                    <Checkbox
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(checked) => {
                                            column.toggleVisibility(!!checked);
                                        }}
                                    />
                                    <span>{column.id}</span>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className={`rounded-lg border border-border/50 overflow-hidden shadow-sm ${compact ? 'flex-1 min-h-0' : 'w-full'}`}>
                <div className="overflow-x-auto">
                    <Table className="w-full" style={{ width: table.getCenterTotalSize() }}>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={`whitespace-nowrap relative font-semibold ${compact ? 'px-3 py-2 text-xs' : header.id === 'select' ? 'px-2 py-3' : 'px-4 py-3'}`}
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.column.getCanSort() ? (
                                                <div
                                                    className="flex items-center gap-1 cursor-pointer select-none"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getIsSorted() === "asc" ? (
                                                        <ArrowUp className="h-4 w-4" />
                                                    ) : header.column.getIsSorted() === "desc" ? (
                                                        <ArrowDown className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                    )}
                                                </div>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                            {header.column.getCanResize() && (
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className={`absolute right-0 top-0 h-full w-0.5 cursor-col-resize select-none touch-none hover:bg-primary/60 transition-colors ${header.column.getIsResizing() ? 'bg-primary' : 'bg-border'
                                                        }`}
                                                />
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row, rowIndex) => (
                                    <TableRow
                                        key={row.id}
                                        className={`hover:bg-muted/30 transition-colors ${rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const value = cell.getValue();
                                            const style: React.CSSProperties = {
                                                width: cell.column.getSize()
                                            };

                                            // Get numeric value and direction for coloring
                                            const coloringInfo = getNumericValueForColoring(value, cell.column, isMatBench);

                                            // Apply background color for numeric values with better opacity
                                            if (coloringInfo !== null && coloringInfo.value >= 0) {
                                                const baseColor = getColorForValue(coloringInfo.value, coloringInfo.betterIs);
                                                // Reduce opacity for better readability
                                                style.backgroundColor = baseColor.replace('0.3)', '0.15)');
                                            }

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={`font-medium transition-colors ${compact ? 'px-3 py-2.5 text-xs' : 'px-4 py-3'}`}
                                                    style={style}
                                                >
                                                    <div className="flex items-center">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columnCount} className={`h-24 text-center text-muted-foreground ${compact ? 'text-xs' : ''}`}>
                                        No results available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}