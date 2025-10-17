import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useGetModalFunction } from "../api/useGetModalFunction";
import { usePatchModalFunction } from "../api/usePatchModalFunction";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGarden } from "@/features/gardens/api/useGetGarden";

import NotFoundPage from "@/components/NotFoundPage";
import Breadcrumb from "@/components/Breadcrumb";

import { ModalFunction } from "@/types";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import AssociatedMaterials from "../../shared/components/AssociatedMaterials";
import { FunctionSidebar } from "../../shared/components/FunctionSidebar";
import { FunctionHeader } from "../../shared/components/FunctionHeader";
import { FunctionBody } from "../../shared/components/FunctionBody";
import { FunctionExample } from "../../shared/components/FunctionExample";
import { GardenFunction } from "../../shared/types/function.types";
import { generateFunctionBreadcrumbs } from "../../shared/utils/breadcrumb.utils";
import { ownsModalFunction } from "../../shared/utils/ownership.utils";

const ModalFunctionPage = () => {
  const { id, doi: gardenDOI } = useParams() as { id: string; doi?: string };
  const { data: modalFunction, isError, isLoading } = useGetModalFunction(id);
  const { data: garden, isLoading: isGardenLoading } = useGetGarden(gardenDOI || "", {
    enabled: !!gardenDOI,
  });

  const auth = useGlobusAuth();
  const ownsThisFunction = ownsModalFunction(
    auth.authorization?.user?.sub,
    modalFunction?.owner_identity_id,
    auth.isAuthenticated
  );

  const { mutateAsync: patchModalFunction } = usePatchModalFunction();

  const handleUpdate = useCallback(async (updateData: Partial<ModalFunction>) => {
    if (modalFunction?.id) {
      await patchModalFunction({
        id: modalFunction.id,
        modalFunction: updateData
      });
    }
  }, [patchModalFunction, modalFunction?.id]);

  if (isLoading || (gardenDOI && isGardenLoading)) return <LoadingOverlay />;

  if (isError || !modalFunction) return <NotFoundPage />;

  const gardenFunction: GardenFunction = {
    ...modalFunction,
    functionType: 'modal',
  };

  const breadcrumbItems = generateFunctionBreadcrumbs(modalFunction.title, gardenDOI, garden);

  const generateDefaultExample = (functionName: string, gardenDOI?: string) => {
    const doiExpression = gardenDOI ? `'${gardenDOI}'` : "my_garden_doi";
    return `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(${doiExpression})

input = ['Data Here']
return my_garden.${functionName}(input)`;
  };

  return (
    <div className="container mb-6 max-w-7xl mx-auto px-4 md:px-6 pt-6 font-display">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <Breadcrumb className="mb-3" crumbs={breadcrumbItems} />
          <FunctionHeader
            functionData={modalFunction}
            functionType="modal"
            gardenDOI={gardenDOI}
            ownsThisFunction={ownsThisFunction}
            onUpdate={handleUpdate}
          />
          <FunctionBody
            functionData={modalFunction}
            ownsThisFunction={ownsThisFunction}
            onUpdate={handleUpdate}
          />
          <FunctionExample
            functionData={modalFunction}
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

export default ModalFunctionPage;
