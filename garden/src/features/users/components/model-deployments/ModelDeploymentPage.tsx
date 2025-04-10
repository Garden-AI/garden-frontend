import { useParams, Navigate } from "react-router-dom";
import { useGetModelDeployments } from "../../api/useGetModelDeployments";
import { ModelDeploymentDetails } from "./ModelDeplotmentDetails";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useGetUserInfo } from "../../api/useGetUserInfo";
import { useGlobusAuth } from "@globus/react-auth-context";

const ModelDeploymentPage = () => {
    const { name } = useParams<{ name: string }>();
    const { data: modelDeployments, isLoading: isLoadingDeployments } = useGetModelDeployments();
    const { data: userInfo, isLoading: isLoadingUser } = useGetUserInfo();
    const auth = useGlobusAuth();

    if (isLoadingDeployments || isLoadingUser) {
        return <LoadingOverlay />;
    }

    const modelDeployment = modelDeployments?.find(deployment => deployment.name === name);

    if (!modelDeployment) {
        return <div>Model deployment not found</div>;
    }

    // Check if the current user is the owner of the deployment
    const isOwner = modelDeployment.originalData?.owner_identity_id === userInfo?.identity_id;

    // If user is not the owner, redirect to home page
    if (!isOwner) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <h1>{modelDeployment.name}</h1>
            <ModelDeploymentDetails entity={modelDeployment.originalData} />
        </div>
    );
};

export default ModelDeploymentPage; 