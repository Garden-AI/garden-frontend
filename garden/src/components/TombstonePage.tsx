import { Garden } from "@/types";
import { CircleAlert } from "lucide-react";

const TombstonePage = ({ garden }: { garden: Garden }) => {
  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-16 font-display sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">Garden Archived</h1>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <CircleAlert className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{garden.title}</h2>
              <p className="text-slate-500">{garden.authors?.join(", ")}</p>
              <p className="text-slate-800">{garden.year}</p>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Garden Information</h3>
            <p className="mb-2 text-slate-500">
              <strong>DOI: </strong>
              {garden.doi}
            </p>
            <p className="mb-2 text-slate-500">
              <strong>URL: </strong>
              https://thegardens.ai/#/garden/{encodeURIComponent(garden.doi)}
            </p>
            <p className="text-slate-500">
              This resource has been archived by the owner and is no longer available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TombstonePage;
