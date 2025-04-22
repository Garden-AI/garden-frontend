import DeploymentPage from "@/features/modal/components/DeploymentPage";

/**
 * Specialized deployment page that redirects to garden creation after deployment
 */
const DeployAndCreateGardenPage = () => {
  return (
    <DeploymentPage 
      redirectUrl="/garden/create?modalAppId=:id"
      title="Deploy Model & Create Garden"
      description="Upload and deploy a Modal app, then create a garden with it."
    />
  );
};

export default DeployAndCreateGardenPage; 