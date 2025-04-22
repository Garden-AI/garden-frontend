import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { useNavigate } from "react-router-dom";
import { ModelDeployment } from "@/features/users/components/ModelDeployments";

interface ModelDeploymentsTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
}

export function ModelDeploymentsTable<TData extends ModelDeployment, TValue>({
    columns,
    data,
}: ModelDeploymentsTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const navigate = useNavigate();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    });

    return (
        <div className="flex flex-col">
            <div className="rounded-md border mt-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/model-deployments/${row.original.originalData.id}`)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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