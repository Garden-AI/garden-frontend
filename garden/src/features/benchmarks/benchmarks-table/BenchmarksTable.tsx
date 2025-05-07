import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table"

interface BenchmarksTableProps<TData, TValue> {
    columns?: ColumnDef<TData, TValue>[]
    data: TData[]
    generateColumns?: boolean
}

// Helper function to generate columns from data
export const generateColumnsFromData = <TData extends Record<string, unknown>, TValue>(
    data: TData[]
): ColumnDef<TData, TValue>[] => {
    if (!data.length) return [];

    // Get all unique keys from all data objects
    const allKeys = new Set<string>();
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            allKeys.add(key);
        });
    });

    // Convert to array and sort alphabetically
    const keys = Array.from(allKeys).sort();

    // Create column definitions
    return keys.map(key => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        enableSorting: true,
    })) as ColumnDef<TData, TValue>[];
};

export const BenchmarksTable = <TData extends Record<string, unknown>, TValue>({
    columns,
    data,
    generateColumns = false
}: BenchmarksTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([])

    // Generate columns if needed, otherwise use provided columns
    const tableColumns = useMemo(() => {
        if (generateColumns) {
            return generateColumnsFromData<TData, TValue>(data);
        }
        return columns || [];
    }, [columns, data, generateColumns]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
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
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}