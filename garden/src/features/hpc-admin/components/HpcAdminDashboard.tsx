import React, { useState } from "react";
import { CreateHpcEndpointForm } from "./CreateHpcEndpointForm";
import { CreateHpcFunctionForm } from "./CreateHpcFunctionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { useHpcEndpoints } from "../api/useHpcEndpoints";
import { useHpcFunctions } from "../api/useHpcFunctions";

const HpcAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("endpoints");

  const { data: endpoints, refetch: refetchEndpoints } = useHpcEndpoints();
  const { refetch: refetchFunctions } = useHpcFunctions();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">HPC Administration</h1>
        <p className="mt-2 text-muted-foreground">
          Manage HPC endpoints and functions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
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

        <TabsContent value="functions" className="space-y-6">
          <div className="rounded-lg border bg-blue-50 p-4">
            <p className="text-sm text-gray-700">
              Upload groundhog-hpc scripts containing functions decorated with @hog.function().
              Functions must be callable through Globus Compute—all imports must be in function
              scope and the function must be serializable.
            </p>
          </div>

          <CreateHpcFunctionForm onSuccess={() => refetchFunctions()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HpcAdminDashboard;
