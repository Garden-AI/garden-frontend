import { ColumnDef } from "@tanstack/react-table";
import { StatusHeader } from "./model-deployments/StatusHeader";
import { ModelDeploymentsTable } from "./model-deployments/ModelDeploymentsTable";

export interface ModelDeployment {
    name: string,
    status: "deployed" | "undeployed" | "error",
    type: "Modal App" | "GCMU",
<<<<<<< HEAD
    originalData: any, // Will be either ModalAppMetadataResponse or future GCMU type
=======
>>>>>>> staging
}

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
