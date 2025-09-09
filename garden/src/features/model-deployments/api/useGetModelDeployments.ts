import instance from "@/lib/axios";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useQuery } from "@tanstack/react-query";
import { ModelDeployment } from "../ModelDeployments";
import { components } from "@/types/backend-schema";

type ModalAppResponse = components["schemas"]["AsyncModalAppMetadataResponse"];

// Helper function to map deploy status to internal status
const mapDeployStatus = (deployStatus: string | undefined): string => {
    switch (deployStatus) {
        case "done":
            return "deployed";
        case "error":
        case "timed_out":
            return "error";
        case "pending":
            return "undeployed";
        default:
            return "undeployed";
    }
};

const getModelDeployments = async (): Promise<ModelDeployment[]> => {
    const modalAppsResponse = await instance.get<ModalAppResponse[]>(`/modal-apps/`);
    // TODO get GCMU deployments once they exist, combine them with modal apps
    return modalAppsResponse.data.map((ma: ModalAppResponse) => {
        return {
            id: ma.id ?? -1,
            name: ma.original_app_name || ma.app_name,
            status: mapDeployStatus(ma.deploy_status),
            type: "Modal App",
            originalData: ma,
        };
    });
};

export const useGetModelDeployments = (options?: {
    refetchInterval?: number;
    enabled?: boolean;
}) => {
    const auth = useGlobusAuth();
    return useQuery<ModelDeployment[]>({
        queryKey: ["modelDeployments"],
        queryFn: getModelDeployments,
        enabled: auth.isAuthenticated && (options?.enabled !== false),
        refetchInterval: options?.refetchInterval,
        refetchIntervalInBackground: false,
    });
};