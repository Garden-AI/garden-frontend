import { ColumnDef } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/shadcn/table";
import { Checkbox } from "@/components/shadcn/checkbox";
import { StatusHeader } from "./model-deployments/StatusHeader";
import { ModelDeploymentsTable } from "./model-deployments/ModelDeploymentsTable";

export interface ModelDeployment {
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
    undeployed: 'bg-gray-200 text-black',
    error: 'bg-red-100 text-red-800',
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
            return (<StatusHeader
                colors={statusColors}
            />);
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as ModelDeployment['status'];
            const colorClass = statusColors[status];
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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

export const DeploymentDetails = ({ deployment }: { deployment: ModelDeployment }) => {
    return (
        <div className="bg-gray-50 p-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Details</TableCell>
                        <TableCell>More data here</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};


interface ModelDeploymentsProps {
    modelDeployments: ModelDeployment[],
}

export const ModelDeployments = ({ modelDeployments }: ModelDeploymentsProps) => {
    return (
        <div>
            <ModelDeploymentsTable columns={columns} data={modelDeployments} />
        </div>
    )
}
