import { useParams, Navigate } from "react-router-dom";
import { useGetModelDeployments } from "../../api/useGetModelDeployments";
import { ModelDeploymentDetails } from "./ModelDeploymentDetails";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useGetUserInfo } from "../../api/useGetUserInfo";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import NotFoundPage from "@/components/NotFoundPage";

const ModelDeploymentPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: modelDeployments, isLoading: isLoadingDeployments } = useGetModelDeployments();
    const { data: userInfo, isLoading: isLoadingUser } = useGetUserInfo();
    const auth = useGlobusAuth();

    if (isLoadingDeployments || isLoadingUser) {
        return <LoadingOverlay />;
    }

    const deploymentId = parseInt(id || '', 10);
    
    // Handle NaN case for invalid IDs
    if (isNaN(deploymentId)) {
        return <NotFoundPage />;
    }
    
    const modelDeployment = modelDeployments?.find(deployment => deployment.originalData.id === deploymentId);

    if (!modelDeployment) {
        return <NotFoundPage />;
    }

    // Check if the current user is the owner of the deployment, or a super user
    const isOwner = (modelDeployment.originalData?.owner_identity_id === userInfo?.identity_id) || SUPER_USERS.includes(userInfo?.identity_id || "");

    // If user is not the owner, redirect to home page
    if (!isOwner) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <ModelDeploymentDetails entity={modelDeployment.originalData} />
        </div>
    );
};

export default ModelDeploymentPage; 