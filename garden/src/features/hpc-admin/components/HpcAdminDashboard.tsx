import React, { useState } from "react";
import { CreateHpcEndpointForm } from "./CreateHpcEndpointForm";
import { CreateHpcDeploymentForm } from "./CreateHpcDeploymentForm";
import { CreateHpcFunctionForm } from "./CreateHpcFunctionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { useHpcEndpoints } from "../api/useHpcEndpoints";
import { useHpcDeployments } from "../api/useHpcDeployments";
import { useHpcFunctions } from "../api/useHpcFunctions";

const HpcAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("endpoints");

  const { data: endpoints, refetch: refetchEndpoints } = useHpcEndpoints();
  const { data: deployments, refetch: refetchDeployments } = useHpcDeployments();
  const { data: functions, refetch: refetchFunctions } = useHpcFunctions();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">HPC Administration</h1>
        <p className="mt-2 text-muted-foreground">
          Manage HPC endpoints, deployments, and functions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          <div className="rounded-lg border bg-blue-50 p-4">
            <p className="text-sm text-gray-700">
              HPC endpoints are Globus Compute multi-user endpoints (MEPs) identified by a
              human-friendly name and the UUID of the endpoint.
            </p>
          </div>

          <CreateHpcEndpointForm onSuccess={() => refetchEndpoints()} />

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Existing Endpoints</h3>
            {endpoints && endpoints.length > 0 ? (
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="rounded-md border p-3">
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-sm text-muted-foreground">
                      UUID: {endpoint.gcmu_id}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No endpoints created yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-6">
          <div className="rounded-lg border bg-blue-50 p-4">
            <p className="text-sm text-gray-700">
              Deployments are conda environments with the Python dependencies necessary to run
              functions. We assume the conda environment already exists on the target endpoint
              and need the full path to the environment. Since the path may differ across
              endpoints, create a separate deployment for each endpoint. If the path is
              identical on different endpoints, you can associate the same deployment with
              multiple endpoints.
            </p>
          </div>

          <CreateHpcDeploymentForm onSuccess={() => refetchDeployments()} />

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Existing Deployments</h3>
            {deployments && deployments.length > 0 ? (
              <div className="space-y-2">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="rounded-md border p-3">
                    <div className="font-medium">Deployment {deployment.id}</div>
                    {deployment.conda_env_path && (
                      <div className="text-sm text-muted-foreground">
                        Conda: {deployment.conda_env_path}
                      </div>
                    )}
                    {deployment.endpoint_ids && deployment.endpoint_ids.length > 0 && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        Endpoints: {deployment.endpoint_ids.length} configured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No deployments created yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="functions" className="space-y-6">
          <div className="rounded-lg border bg-blue-50 p-4">
            <p className="text-sm text-gray-700">
              Functions must be callable through Globus Compute—all imports must be in function
              scope and the function must be serializable. Functions are executed in the context
              of a deployment and can be associated with multiple deployments if the required
              dependencies are available on multiple endpoints.
            </p>
          </div>

          <CreateHpcFunctionForm onSuccess={() => refetchFunctions()} />

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Existing Functions</h3>
            {functions && functions.length > 0 ? (
              <div className="space-y-3">
                {functions.map((func) => (
                  <div key={func.id} className="rounded-md border p-4">
                    <div className="font-medium">{func.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {func.function_name}
                    </div>
                    {func.description && (
                      <div className="mt-1 text-sm">{func.description}</div>
                    )}
                    {func.available_deployments && func.available_deployments.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Deployments: {func.available_deployments.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No functions created yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HpcAdminDashboard;
