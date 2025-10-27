import React from "react";
import { useParams } from "react-router-dom";

import { useGetHpcFunction } from "../api/useGetHpcFunction";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetGarden } from "@/features/gardens/api/useGetGarden";

import NotFoundPage from "@/components/NotFoundPage";
import Breadcrumb from "@/components/Breadcrumb";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import { FunctionSidebar } from "../../shared/components/FunctionSidebar";
import { GardenFunction } from "../../shared/types/function.types";
import { generateFunctionBreadcrumbs } from "../../shared/utils/breadcrumb.utils";
import { canEditHpcFunction } from "../../shared/utils/ownership.utils";
import { HpcFunctionContent } from "./HpcFunctionContent";

const HpcFunctionPage = () => {
  const { id, doi: gardenDOI } = useParams() as { id: string; doi?: string };
  const { data: hpcFunction, isError, isLoading } = useGetHpcFunction(id);
  const { data: garden, isLoading: isGardenLoading } = useGetGarden(gardenDOI || "", {
    enabled: !!gardenDOI,
  });

  const auth = useGlobusAuth();
  const ownsThisFunction = canEditHpcFunction(auth.authorization?.user?.sub);

  if (isLoading || (gardenDOI && isGardenLoading)) return <LoadingOverlay />;

  if (isError || !hpcFunction) return <NotFoundPage />;

  const gardenFunction: GardenFunction = {
    ...hpcFunction,
    functionType: 'hpc',
  };

  const breadcrumbItems = generateFunctionBreadcrumbs(hpcFunction.title, gardenDOI, garden);

  return (
    <div className="container mb-6 max-w-7xl mx-auto px-4 md:px-6 pt-6 font-display">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <Breadcrumb className="mb-3" crumbs={breadcrumbItems} />
          <HpcFunctionContent
            hpcFunction={hpcFunction}
            ownsThisFunction={ownsThisFunction}
            gardenDOI={gardenDOI}
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
