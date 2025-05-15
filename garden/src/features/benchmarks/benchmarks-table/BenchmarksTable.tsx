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
import { useGetModalFunction } from "@/features/modal/api/useGetModalFunction";
import { Link } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

interface BenchmarksTableProps<TData, TValue> {
    columns?: ColumnDef<TData, TValue>[]
    data: TData[]
    generateColumns?: boolean
}

// Default column sizes
const DEFAULT_COLUMN_SIZE = 100;
const FUNCTION_COLUMN_SIZE = 180;
const DATE_COLUMN_SIZE = 120;

// Helper function to generate columns from data
export const generateColumnsFromData = <TData extends Record<string, unknown>, TValue>(
    data: TData[]
): ColumnDef<TData, TValue>[] => {
    if (!data.length) return [];

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

    // Convert to array and sort alphabetically
    const keys = Array.from(allKeys).sort();

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
        header: key, // Use the exact key name as the header
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: DEFAULT_COLUMN_SIZE,
        cell: ({ row }) => {
            const value = row.getValue(key);

            // Handle complex objects with parsedValue
            if (value && typeof value === 'object' && 'parsedValue' in value) {
                const parsedValue = (value as { parsedValue: number }).parsedValue;
                return typeof parsedValue === 'number' ? parsedValue.toFixed(3) : parsedValue;
            }

            // Format numbers to 3 decimal places
            if (typeof value === 'number') {
                return Number(value).toFixed(3);
            }

            return value;
        }
    })) as ColumnDef<TData, TValue>[];

    return [functionColumn, dateColumn, ...dynamic_columns];
};

// Component to fetch and display function name
const FunctionNameCell = ({ functionId }: { functionId: string }) => {
    const { data, isLoading, error } = useGetModalFunction(functionId);

    if (isLoading) return <span>Loading...</span>;
    if (error) return <span>Error loading function</span>;

    return (
        <div className="flex flex-col">
            <Link to={`/modal-functions/${functionId}`} className="font-medium">{data?.title || "Unknown Function"}</Link>
        </div>
    );
};

export const BenchmarksTable = <TData extends Record<string, unknown>, TValue>({
    columns,
    data,
}: BenchmarksTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columnResizeMode: ColumnResizeMode = 'onChange';

    const table = useReactTable({
        data,
        columns: columns || [],
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

    // Correctly determine column count for empty state
    const columnCount = table.getAllColumns().length;

    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto flex items-center gap-1"
                        >
                            <EyeOff className="h-4 w-4" />
                            <span>Columns</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns()
                            .filter(column => column.getCanHide())
                            .map(column => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table className="w-full" style={{ width: table.getCenterTotalSize() }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap px-2 relative"
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
                                                className={`absolute right-0 top-0 h-full w-0.5 cursor-col-resize select-none touch-none hover:bg-gray-400 ${header.column.getIsResizing() ? 'bg-blue-500' : 'bg-gray-200'
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
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-2"
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}