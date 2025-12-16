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
import {
    isMatBenchDiscovery,
    hasMatBenchMetrics
} from "../utils/matbench";
import { useBenchmarkColumns, getNumericValueForColoring } from "./useBenchmarkColumns";
import { getColorForValue } from "../utils/formatting";

interface BenchmarksTableProps<TData, TValue> {
    columns?: ColumnDef<TData, TValue>[]
    data: TData[]
    generateColumns?: boolean
    benchmarkName?: string
    compact?: boolean
    rowSelection?: RowSelectionState
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

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
    const generatedColumns = useBenchmarkColumns(data, benchmarkName);
    const baseColumns = useMemo(() =>
        columns || generatedColumns,
        [columns, generatedColumns]
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
                                            const coloringInfo = getNumericValueForColoring(value, cell.column as any, isMatBench);

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