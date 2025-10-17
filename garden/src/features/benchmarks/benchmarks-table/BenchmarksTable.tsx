import React, { useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, EyeOff } from "lucide-react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
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
import { useGetModalFunction } from "@/features/functions/modal/api/useGetModalFunction";
import { Link } from "react-router-dom";
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
}

// Default column sizes
const DEFAULT_COLUMN_SIZE = 100;
const FUNCTION_COLUMN_SIZE = 180;
const DATE_COLUMN_SIZE = 120;

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
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            // Exclude function_id and date_invoked since we'll handle them separately
            if (key !== "function_id" && key !== "date_invoked") {
                allKeys.add(key);
            }
        });
    });

    // Convert to array and sort - prioritize primary metrics for MatBench
    let keys = Array.from(allKeys);
    if (isMatBench) {
        const primaryMetrics = ['F1', 'DAF', 'Accuracy', 'f1_score', 'daf', 'accuracy'];
        const otherKeys = keys.filter(k => !primaryMetrics.includes(k)).sort();
        keys = [...primaryMetrics.filter(k => keys.includes(k)), ...otherKeys];
    } else {
        keys = keys.sort();
    }

    // Define function column first
    const functionColumn = {
        accessorKey: "function_id",
        header: "Function",
        enableSorting: true,
        enableHiding: false, // Don't allow hiding the function column
        enableResizing: true,
        size: FUNCTION_COLUMN_SIZE,
        cell: ({ row }) => {
            const functionId = String(row.getValue("function_id"));
            return <FunctionNameCell functionId={functionId} />;
        }
    } as ColumnDef<TData, TValue>;

    // Define date column second
    const dateColumn = {
        accessorKey: "date_invoked",
        header: "Date",
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: DATE_COLUMN_SIZE,
        cell: ({ row }) => {
            const dateInvoked = row.getValue("date_invoked");
            // If date is not available, return empty string
            if (!dateInvoked) return "";

            // Format as yyyy-mm-dd
            try {
                const date = new Date(dateInvoked as string);
                return date.toISOString().split('T')[0]; // Get yyyy-mm-dd part
            } catch {
                return String(dateInvoked); // Return original value if parsing fails
            }
        }
    } as ColumnDef<TData, TValue>;

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
            return key; // Use the exact key name as the header for non-MatBench
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: DEFAULT_COLUMN_SIZE,
        cell: ({ row }) => {
            const value = row.getValue(key);
            
            if (isMatBench && MATBENCH_METRICS[key]) {
                // Get F1 score and DAF for performance tier calculation (try both cases)
                const f1Score = getNumericValue(row.getValue('F1')) || getNumericValue(row.getValue('f1_score'));
                const daf = getNumericValue(row.getValue('DAF')) || getNumericValue(row.getValue('daf'));
                
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
                displayValue = String(value);
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

    return [functionColumn, dateColumn, ...dynamic_columns];
};

// Helper function to extract numeric values
const getNumericValue = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return value;
    }
    if (value && typeof value === 'object' && 'parsedValue' in value) {
        const parsedValue = (value as { parsedValue: unknown }).parsedValue;
        return typeof parsedValue === 'number' ? parsedValue : null;
    }
    return null;
};

// Component to fetch and display function name
const FunctionNameCell = ({ functionId }: { functionId: string }) => {
    const { data, isLoading, error } = useGetModalFunction(functionId);

    if (isLoading) return <span className="text-muted-foreground text-sm">Loading...</span>;
    if (error) return <span className="text-destructive text-sm">Error loading function</span>;

    return (
        <div className="flex flex-col">
            <Link 
                to={`/modal-functions/${functionId}`} 
                className="font-semibold text-primary hover:text-primary/80 transition-colors truncate"
                title={data?.title || "Unknown Function"}
            >
                {data?.title || "Unknown Function"}
            </Link>
            <span className="text-xs text-muted-foreground">ID: {functionId}</span>
        </div>
    );
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
}: BenchmarksTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columnResizeMode: ColumnResizeMode = 'onChange';
    
    // Determine if this is MatBench data for coloring purposes
    const isMatBench = (benchmarkName && isMatBenchDiscovery(benchmarkName)) || hasMatBenchMetrics(data);

    const table = useReactTable({
        data,
        columns: columns || generateColumnsFromData(data, benchmarkName),
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        columnResizeMode,
        state: {
            sorting,
            columnVisibility,
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
                                        className={`whitespace-nowrap relative font-semibold ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-3'}`}
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