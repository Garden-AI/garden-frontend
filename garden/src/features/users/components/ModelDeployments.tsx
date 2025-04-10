import { ColumnDef } from "@tanstack/react-table";
import { StatusHeader } from "./model-deployments/StatusHeader";
import { ModelDeploymentsTable } from "./model-deployments/ModelDeploymentsTable";

export interface ModelDeployment {
    name: string,
    status: "deployed" | "undeployed" | "error",
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
        status: "deployed",
        type: "GCMU",
    },
];

const statusColors = {
    deployed: 'bg-green/30 text-darkgreen',
    undeployed: 'bg-gray-200 text-black',
    error: 'bg-red-100 text-red-800',
};


export const columns: ColumnDef<ModelDeployment>[] = [
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
