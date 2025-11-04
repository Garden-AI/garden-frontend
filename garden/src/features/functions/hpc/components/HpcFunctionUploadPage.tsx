import React from "react";
import { CreateHpcFunctionForm } from "./CreateHpcFunctionForm";

interface HpcFunctionUploadPageProps {
  onSuccess?: (ids: number[]) => void;
}

/**
 * Wrapper page for uploading HPC functions during garden creation
 * Receives created function IDs and passes them to onSuccess callback
 */
const HpcFunctionUploadPage = ({ onSuccess }: HpcFunctionUploadPageProps) => {
  const handleSuccess = (createdIds?: number[]) => {
    if (onSuccess && createdIds && createdIds.length > 0) {
      onSuccess(createdIds);
    }
  };

  return (
    <div>
      <CreateHpcFunctionForm onSuccess={handleSuccess} />
    </div>
  );
};

export default HpcFunctionUploadPage;
