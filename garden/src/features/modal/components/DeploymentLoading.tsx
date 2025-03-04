import LoadingSpinner from "@/components/LoadingSpinner";

interface DeploymentLoadingProps {
  isVisible: boolean;
}

export const DeploymentLoading = ({ isVisible }: DeploymentLoadingProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="my-8 flex flex-col items-center justify-center space-y-4 text-center">
      <div className="scale-75">
        <LoadingSpinner />
      </div>
      <p className="text-base font-medium text-gray-700">
        Deploying your Modal app...
      </p>
    </div>
  );
}; 