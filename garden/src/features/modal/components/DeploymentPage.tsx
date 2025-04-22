import { useGetGlobusGroups } from "@/features/gardens/api/useGetGlobusGroups";
import { ModalAppForm } from "./ModalAppForm";
import { GlobusGroupError } from "@/features/globus/components/GlobusGroupError";

interface DeploymentPageProps {
  /**
   * Optional URL to redirect to after successful deployment
   * If not provided, will redirect to the deployment details page
   */
  redirectUrl?: string;
  /**
   * Title for the deployment page
   */
  title?: string;
  /**
   * Description for the deployment page
   */
  description?: string;
}

/**
 * Page for deploying Modal apps
 * Can be configured to redirect to garden creation or to the model deployment details
 */
const DeploymentPage = ({ 
  redirectUrl = "/model-deployments/:id",
  title = "Deploy Modal App",
  description = "Upload and deploy a Modal app to make it available for use in gardens."
}: DeploymentPageProps) => {
  const { data: groups } = useGetGlobusGroups();

  if (!groups?.find((group) => group.id === import.meta.env.VITE_GLOBUS_GROUP_UUID)) {
    return <GlobusGroupError />;
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      <DeploymentHeader title={title} description={description} />
      
      <ModalAppForm 
        showSuccessScreen={redirectUrl === "/model-deployments/:id"}
        redirectUrl={redirectUrl}
      />
    </div>
  );
};

interface DeploymentHeaderProps {
  title: string;
  description: string;
}

const DeploymentHeader = ({ title, description }: DeploymentHeaderProps) => {
  return (
    <div className="mb-12 flex items-center space-x-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default DeploymentPage; 