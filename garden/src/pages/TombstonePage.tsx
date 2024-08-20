import React from "react";
import { Garden } from "@/api/types";
import GardenDropdownOptions from "@/components/GardenDropdownOptions";
import { CircleAlert, TriangleAlert } from "lucide-react";

export default function TombstonePage({ garden }: { garden: Garden }) {
  return (
    <div className="min-h-[80vh] bg-gray-100 px-4 py-16 font-display sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Garden Archived
            </h1>
            <GardenDropdownOptions garden={garden} />
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
              <CircleAlert className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {garden.title}
              </h2>
              <p className="text-gray-600">{garden.authors?.join(", ")}</p>
              <p className="text-gray-800">{garden.year}</p>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Garden Information
            </h3>
            <p className="mb-2 text-gray-600">
              <strong>DOI: </strong>
              {garden.doi}
            </p>
            <p className="mb-2 text-gray-600">
              <strong>URL: </strong>
              https://thegardens.ai/#/garden/{encodeURIComponent(garden.doi)}
            </p>
            <p className="text-gray-600">
              This resource has been archived by the owner and is no longer
              available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
