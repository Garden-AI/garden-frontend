import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useGetHpcFunction } from "../api/useGetHpcFunction";
import { usePatchHpcFunction } from "../api/usePatchHpcFunction";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGarden } from "@/features/gardens/api/useGetGarden";

import NotFoundPage from "@/components/NotFoundPage";
import Breadcrumb from "@/components/Breadcrumb";

import { HpcFunctionPatchRequest } from "@/types";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import AssociatedMaterials from "../../shared/components/AssociatedMaterials";
import { FunctionSidebar } from "../../shared/components/FunctionSidebar";
import { FunctionHeader } from "../../shared/components/FunctionHeader";
import { FunctionBody } from "../../shared/components/FunctionBody";
import { FunctionExample } from "../../shared/components/FunctionExample";
import { GardenFunction } from "../../shared/types/function.types";
import { generateFunctionBreadcrumbs } from "../../shared/utils/breadcrumb.utils";
import { canEditHpcFunction } from "../../shared/utils/ownership.utils";

const HpcFunctionPage = () => {
  const { id, doi: gardenDOI } = useParams() as { id: string; doi?: string };
  const { data: hpcFunction, isError, isLoading } = useGetHpcFunction(id);
  const { data: garden, isLoading: isGardenLoading } = useGetGarden(gardenDOI || "", {
    enabled: !!gardenDOI,
  });

  const auth = useGlobusAuth();
  const ownsThisFunction = canEditHpcFunction(auth.authorization?.user?.sub);
  const { mutateAsync: patchHpcFunction } = usePatchHpcFunction(parseInt(id));

  const handleUpdate = useCallback(async (updateData: HpcFunctionPatchRequest) => {
    await patchHpcFunction(updateData);
  }, [patchHpcFunction]);

  if (isLoading || (gardenDOI && isGardenLoading)) return <LoadingOverlay />;

  if (isError || !hpcFunction) return <NotFoundPage />;

  const gardenFunction: GardenFunction = {
    ...hpcFunction,
    functionType: 'hpc',
  };

  const breadcrumbItems = generateFunctionBreadcrumbs(hpcFunction.title, gardenDOI, garden);

  const generateDefaultExample = (functionName: string, gardenDOI?: string) => {
    const doiExpression = gardenDOI ? `'${gardenDOI}'` : "my_garden_doi";
    return `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(${doiExpression})

# Note: HPC function execution happens via Globus Compute.
input = ['Data Here']
future = my_garden.${functionName}.submit(input, endpoint='my-globus-compute-endpoint')
results = future.result()`;
  };

  return (
    <div className="container mb-6 max-w-7xl mx-auto px-4 md:px-6 pt-6 font-display">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <Breadcrumb className="mb-3" crumbs={breadcrumbItems} />
          <FunctionHeader
            functionData={hpcFunction}
            functionType="hpc"
            gardenDOI={gardenDOI}
            ownsThisFunction={ownsThisFunction}
            onUpdate={handleUpdate}
          />
          <FunctionBody
            functionData={hpcFunction}
            ownsThisFunction={ownsThisFunction}
            onUpdate={handleUpdate}
          />
          <FunctionExample
            functionData={hpcFunction}
            ownsThisFunction={ownsThisFunction}
            onUpdate={handleUpdate}
            generateDefaultExample={generateDefaultExample}
            gardenDOI={gardenDOI}
          />
          <AssociatedMaterials
            resource={gardenFunction}
            ownsThisFunction={ownsThisFunction}
          />
        </div>

        {/* Sidebar */}
        <FunctionSidebar
          gardenFunction={gardenFunction}
          ownsThisFunction={ownsThisFunction}
        />
      </div>
    </div>
  );
};

export default HpcFunctionPage;
