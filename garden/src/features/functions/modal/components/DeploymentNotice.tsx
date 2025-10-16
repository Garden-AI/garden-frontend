import { InfoIcon } from "lucide-react";

interface DeploymentNoticeProps {
  isVisible: boolean;
}

export const DeploymentNotice = ({ isVisible }: DeploymentNoticeProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
      <h4 className="font-medium">Deployment in Progress</h4>
      <p className="mt-2 text-sm">
        Your Modal app is being deployed. This may take a few minutes if your app has large dependencies.
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-md bg-blue-100 p-2 text-xs">
        <InfoIcon className="h-4 w-4" />
        <span>The next step will be configuring your Garden's details once deployment completes.</span>
      </div>
    </div>
  );
}; 