import { ModalAppForm } from "./ModalAppForm";

const ModalAppUploadPage = () => {

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      <div className="mb-12 flex items-center space-x-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-light">Create a New Modal App Deployment</h1>
        </div>
      </div>
      <ModalAppForm 
        showOverallProgress={false}
        showSuccessScreen={true}
        viewDeploymentsUrl="/user?tab=model-deployments"
      />
    </div>
  );
};

export default ModalAppUploadPage; 