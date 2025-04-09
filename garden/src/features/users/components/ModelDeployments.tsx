import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table";

interface ModelDeployment {
    id: number,
    name: string,
    status: "frozen" | "deployed" | "undeployed",
    type: "Modal App" | "GCMU",
}

// Some fake data so we can populate the table while building it out
export const fakeDeployments: ModelDeployment[] = [
    {
        id: 1,
        name: "Test Modal App",
        status: "deployed",
        type: "Modal App",
    },
    {
        id: 2,
        name: "Test GCMU",
        status: "deployed",
        type: "GCMU",
    },
    {
        id: 3,
        name: "Test Modal App 2",
        status: "undeployed",
        type: "Modal App",
    },
    {
        id: 4,
        name: "Test GCMU 2",
        status: "frozen",
        type: "GCMU",
    },
];

export const columns: ColumnDef<ModelDeployment>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
];

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
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
    )
}

interface ModelDeploymentsProps {
    modelDeployments: ModelDeployment[],
}

export const ModelDeployments = ({modelDeployments}: ModelDeploymentsProps) => {
    return (
        <div>
            <DataTable columns={columns} data={modelDeployments}/>
        </div>
    )
}