import { CreateGardenForm } from "./CreateGardenForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetGlobusGroups } from "../../api/useGetGlobusGroups";

const CreateGardenPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const formType = searchParams.get("type");

  const { data: groups } = useGetGlobusGroups();

  if (
    formType == "modal" &&
    !groups?.find((group) => group.id === import.meta.env.VITE_GLOBUS_GROUP_UUID)
  )
    return <GlobusGroupError />;

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      <CreateGardenFormHeader />

      {formType === null ? (
        <div>
          <div className="space-y-8 ">
            <div className="flex items-center justify-between rounded-lg border px-8 py-12 shadow-sm">
              <div className="flex items-center gap-x-8">
                <img src="img/extern-logos/modal.svg" alt="" className="rounded-sm bg-black p-2" />
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
                <img className="h-8" src="img/garden-logo.jpg" alt="" />
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
};

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

const GlobusGroupError = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="mx-auto max-w-4xl px-8 py-24 font-display">
      <div className="flex h-96 items-center justify-center ">
        <div className="space-y-12 text-center">
          <h1 className="text-4xl font-bold">Globus Group Required</h1>
          <p className="text-gray-700">
            You must be a part of the Globus Group to create a Modal App. Please email{" "}
            <a href="mailto:wengler@uchicago.edu" className="font-bold text-primary">
              Will Engler (wengler@chicago.edu)
            </a>{" "}
            to be added to the group.
          </p>
          <div className=" flex items-center justify-center space-x-4">
            <Button onClick={() => navigate("/")} className="font-bold">
              Back home
            </Button>
            <Button
              onClick={() => setSearchParams({ type: "entrypoint" })}
              className="font-bold"
              variant={"outline"}
            >
              Create Garden from Entrypoints instead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGardenPage;
