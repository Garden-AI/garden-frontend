import { ModalAppForm } from "./ModalAppForm";

interface ModalAppUploadPageProps {
  onSuccess?: (id: number) => void;
  /** Optional prop to indicate if this is part of a multi-step process */
  isMultiStep?: boolean;
}

const ModalAppUploadPage = ({ onSuccess, isMultiStep = false }: ModalAppUploadPageProps) => {
  return (
    <>
      <div className="mb-12 flex items-center space-x-8">
        <div className="space-y-4">
        </div>
      </div>
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