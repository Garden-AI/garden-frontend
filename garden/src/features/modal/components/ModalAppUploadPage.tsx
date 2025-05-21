import React from "react";
import { ModalAppForm } from "./ModalAppForm";

interface ModalAppUploadPageProps {
  onSuccess?: (id: number) => void;
}

const ModalAppUploadPage = ({ onSuccess }: ModalAppUploadPageProps) => {
  return (
    <>
      <ModalAppForm
        showOverallProgress={false}
        showSuccessScreen={true}
        viewDeploymentsUrl="/user?tab=model-deployments"
        onSuccess={onSuccess}
      />
    </>
  );
};

export default ModalAppUploadPage; 