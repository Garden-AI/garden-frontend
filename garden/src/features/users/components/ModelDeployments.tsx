import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table";
import { InfoIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/shadcn/tooltip";

interface ModelDeployment {
    name: string,
    status: "frozen" | "deployed" | "undeployed" | "error",
    type: "Modal App" | "GCMU",
}

// Some fake data so we can populate the table while building it out
export const fakeDeployments: ModelDeployment[] = [
    {
        name: "Test Modal App",
        status: "deployed",
        type: "Modal App",
    },
    {
        name: "Test GCMU",
        status: "undeployed",
        type: "GCMU",
    },
    {
        name: "Test Modal App 2",
        status: "error",
        type: "Modal App",
    },
    {
        name: "Test GCMU 2",
        status: "frozen",
        type: "GCMU",
    },
];

const statusColors = {
    frozen: 'bg-blue-100 text-blue-800',
    deployed: 'bg-green/30 text-darkgreen',
    undeployed: 'bg-gray-400 text-black',
    error: 'bg-red-100 text-red-800',
};

const StatusHeader = () => {
    return (<div className="flex items-center gap-2">
        <span>Status</span>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                        <p className="font-medium">Status Meanings:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.deployed}`}>
                                    Deployed
                                </span>
                                <span> - model is deployed and ready to run</span>
                            </li>
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.undeployed}`}>
                                    Undeployed
                                </span>
                                <span> - model is not deployed and cannot be run</span>
                            </li>
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.frozen}`}>
                                    Frozen
                                </span>
                                <span> - model has been temporarily undeployed because it has been unused, it will automatically re-deploy when run</span>
                            </li>
                            <li>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.error}`}>
                                    Error
                                </span>
                                <span> - an error occurred during deployment and the model is not runnable</span>
                            </li>
                        </ul>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>);
};

export const columns: ColumnDef<ModelDeployment>[] = [
    {
        accessorKey: 'status',
        header: () => {
            return <StatusHeader />;
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as ModelDeployment['status'];
            const colorClass = statusColors[status];
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {status}
                </span>
            );
        },
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

export const ModelDeployments = ({ modelDeployments }: ModelDeploymentsProps) => {
    return (
        <div>
            <DataTable columns={columns} data={modelDeployments} />
        </div>
    )
}