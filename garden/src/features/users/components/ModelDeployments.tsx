import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, RowSelectionState, Row } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table";
import { InfoIcon, PlayIcon, SquareIcon, Trash2Icon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";

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
    const [open, setOpen] = useState(false);
    
    return (<div className="flex items-center gap-2">
        <span>Status</span>
        <TooltipProvider>
            <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                    <button 
                        onClick={() => setOpen(!open)}
                        className="focus:outline-none"
                    >
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                    </button>
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
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
        </div>
    );
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

interface ModelDeploymentActionsProps {
    selectedDeployments: ModelDeployment[];
    onDeploy: (deployments: ModelDeployment[]) => void;
    onUndeploy: (deployments: ModelDeployment[]) => void;
    onRemove: (deployments: ModelDeployment[]) => void;
}

const ModelDeploymentActions = ({ 
    selectedDeployments, 
    onDeploy: handleDeploy, 
    onRemove: handleRemove, 
    onUndeploy: handleUndeploy 
}: ModelDeploymentActionsProps) => {
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    const canDeploy = selectedDeployments.some((d: ModelDeployment) => d.status === "error" || d.status === "undeployed");
    const canUndeploy = selectedDeployments.some((d: ModelDeployment) => d.status === "deployed" || d.status === "frozen");
    const canRemove = selectedDeployments.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeploy(selectedDeployments)}
                    disabled={!canDeploy}
                >
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Deploy
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUndeploy(selectedDeployments)}
                    disabled={!canUndeploy}
                >
                    <SquareIcon className="mr-2 h-4 w-4" />
                    Undeploy
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRemoveConfirm(true)}
                    disabled={!canRemove}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Remove
                </Button>
            </div>
            <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Model Deployments</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {selectedDeployments.length} model deployment{selectedDeployments.length === 1 ? '' : 's'}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleRemove(selectedDeployments)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}