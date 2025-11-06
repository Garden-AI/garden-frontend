import React, { useState } from "react";
import { ModalAppForm } from "../../functions/modal/components/ModalAppForm";
import { CreateHpcFunctionForm } from "../../functions/hpc/components/CreateHpcFunctionForm";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Cloud, Cpu } from "lucide-react";

interface CreateFunctionFormWrapperProps {
  onSuccess: () => void;
  onDeploymentCreated?: (deployment: ModelDeployment) => void;
}

export const CreateFunctionFormWrapper: React.FC<CreateFunctionFormWrapperProps> = ({
  onSuccess,
  onDeploymentCreated
}) => {
  const [activeTab, setActiveTab] = useState<"modal" | "hpc">("modal");

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "modal" | "hpc")} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="modal" className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          <span>Modal Function</span>
        </TabsTrigger>
        <TabsTrigger value="hpc" className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          <span>HPC Function</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="modal">
        <ModalAppForm
          onDeploymentSuccess={(id: number) => {
            // ModalAppForm passes ID, we'll handle this differently if needed
          }}
          onSuccess={(id: number) => {
            onSuccess();
          }}
        />
      </TabsContent>

      <TabsContent value="hpc">
        <CreateHpcFunctionForm
          onSuccess={(createdFunctionIds) => {
            onSuccess();
          }}
        />
      </TabsContent>
    </Tabs>
  );
};