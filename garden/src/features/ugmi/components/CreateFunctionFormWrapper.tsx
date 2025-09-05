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
    onDeploymentSuccess={(deployment: ModelDeployment) => {
      // Call onDeploymentCreated immediately with the full deployment object
      // No need to refetch user functions - we get functions directly from deployments
      onDeploymentCreated?.(deployment);
    }}
    onSuccess={(id: number) => {
      // This is called when the form wants to close (after deployment starts)
      onSuccess();
    }}
  />
);