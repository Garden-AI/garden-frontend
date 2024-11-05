import { CreateGardenForm } from "./components/CreateGardenForm";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CreateGardenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const formType = searchParams.get("type");

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      <CreateGardenFormHeader />

      {formType === null ? (
        <div>
          <div className="space-y-8 ">
            <div className="flex items-center justify-between rounded-lg border px-8 py-12 shadow-sm">
              <div className="flex items-center gap-x-8">
                <img src="img/modal.svg" alt="" className="rounded-sm bg-black p-2" />
                <div>
                  <h2 className="mb-2 text-lg font-bold">Create Garden from Modal App</h2>
                  <p className="mb-4 text-sm text-gray-700">
                    Create a garden by uploading a modal app that you have created.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSearchParams({ type: "modal" })}
                variant="outline"
                className="font-bold"
              >
                Get Started
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-8 py-12 shadow-sm">
              <div className="flex items-center gap-x-8">
                <img className="h-8" src="img/normalColorIcon_Garden.jpg" alt="" />
                <div>
                  <h2 className="mb-2 text-lg font-bold">Create Garden from Entrypoints</h2>
                  <p className="mb-4 text-sm text-gray-700">
                    Create a garden by selecting one or more entrypoints that you have created.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSearchParams({ type: "entrypoint" })}
                className="font-bold"
                variant={"outline"}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <CreateGardenForm />
      )}
    </div>
  );
}

const CreateGardenFormHeader = () => {
  return (
    <>
      <div className="mb-12 flex items-center space-x-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-light">Create a Garden</h1>
        </div>
      </div>
    </>
  );
};
