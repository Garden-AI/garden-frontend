import instance from "@/lib/axios";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useQuery } from "@tanstack/react-query";
import { ModelDeployment } from "../ModelDeployments";
import { components } from "@/types/backend-schema";

type ModalAppResponse = components["schemas"]["AsyncModalAppMetadataResponse"];

const getModelDeployments = async (): Promise<ModelDeployment[]> => {
    const modalAppsResponse = await instance.get<ModalAppResponse[]>(`/modal-apps/`);
    // TODO get GCMU deployments once they exist, combine them with modal apps
    return modalAppsResponse.data.map((ma: ModalAppResponse) => {
        return {
            id: ma.id ?? -1,
            name: ma.original_app_name || ma.app_name,
            status: ma.deploy_status === "done" ? "deployed" :
                ma.deploy_status === "error" ? "error" :
                    ma.deploy_status === "timed_out" ? "error" : "undeployed",
            type: "Modal App",
            originalData: ma,
        };
    });
};

export const useGetModelDeployments = () => {
    const auth = useGlobusAuth();
    return useQuery<ModelDeployment[]>({
        queryKey: ["modelDeployments"],
        queryFn: getModelDeployments,
        enabled: auth.isAuthenticated,
    });
};