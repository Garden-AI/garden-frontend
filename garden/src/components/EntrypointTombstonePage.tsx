import { CircleAlert } from "lucide-react";

const EntrypointTombstonePage = () => {
  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-16 font-display sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">Entrypoint Archived</h1>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <CircleAlert className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Entrypoint No Longer Available</h2>
              <p className="text-slate-500">This entrypoint has been archived</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrypointTombstonePage;
