import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { DeploymentDetails, ModelDeployment } from "../ModelDeployments";
import { ModelDeploymentActions } from "./ModelDeploymentActions";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

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

    const selectedRows = table.getSelectedRowModel().rows;
    const selectedDeployments = selectedRows.map(row => row.original as ModelDeployment);

    const handleRowClick = (rowId: string, event: React.MouseEvent) => {
        // Check if the click was on a checkbox or its label,
        // avoids surprsing behavior of expanding the row when clicking the checkbox
        const target = event.target as HTMLElement;
        const isCheckboxClick = target.closest('input[type="checkbox"]') ||
            target.closest('label') ||
            target.closest('button');

        if (!isCheckboxClick) {
            if (expandedRow === rowId) {
                setExpandedRow(null);
            } else {
                setExpandedRow(rowId);
            }
        }
    };

    const handleDeploy = () => {
        // TODO: Implement deploy action
        console.log("Deploying:", selectedDeployments);
    };

    const handleUndeploy = () => {
        // TODO: Implement undeploy action
        console.log("Undeploying:", selectedDeployments);
    };

    const handleRemove = () => {
        // TODO: Implement remove action
        console.log("Removing:", selectedDeployments);
    };

    return (
        <div className="flex flex-col">
            <ModelDeploymentActions
                selectedDeployments={selectedDeployments}
                onDeploy={handleDeploy}
                onRemove={handleRemove}
                onUndeploy={handleUndeploy}
            />
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
                                <>
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="cursor-pointer"
                                        onClick={(e) => handleRowClick(row.id, e)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                        <TableCell className="w-8">
                                            {expandedRow === row.id ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {expandedRow === row.id && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + 1} className="p-0">
                                                <DeploymentDetails deployment={row.original as ModelDeployment} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
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