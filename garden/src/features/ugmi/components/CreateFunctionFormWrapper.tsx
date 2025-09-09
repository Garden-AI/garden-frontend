import React from "react";
import { ModalAppForm } from "../../modal/components/ModalAppForm";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { Entity } from "../types";

interface CreateFunctionFormWrapperProps {
  onSuccess: () => void;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
}

export const CreateFunctionFormWrapper: React.FC<CreateFunctionFormWrapperProps> = ({ 
  onSuccess, 
  onDeploymentCreated 
}) => (
  <ModalAppForm
    onDeploymentSuccess={(id: number) => {
      // ModalAppForm passes ID, we'll handle this differently if needed
    }}
    onSuccess={(id: number) => {
      onSuccess();
    }}
  />
);