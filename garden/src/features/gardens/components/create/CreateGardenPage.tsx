import { CreateGardenForm } from "./CreateGardenForm";
import { UploadModalAppForm } from "@/features/modal/components/UploadModalAppForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import { useGetGlobusGroups } from "@/features/gardens/api/useGetGlobusGroups";

const CreateGardenPage = () => {
  const [searchParams] = useSearchParams();
  const modalAppId = searchParams.get("modalAppId");

  const { data: groups } = useGetGlobusGroups();

  if (!groups?.find((group) => group.id === import.meta.env.VITE_GLOBUS_GROUP_UUID)) {
    return <GlobusGroupError />;
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      <CreateGardenFormHeader />
      {modalAppId ? (
        <CreateGardenForm modalAppId={modalAppId} />
      ) : (
        <UploadModalAppForm />
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
  return (
    <div className="mx-auto max-w-4xl px-8 py-24 font-display">
      <div className="flex h-96 items-center justify-center ">
        <div className="space-y-12">
          <h1 className="text-4xl font-bold text-center">Become a Gardener</h1>
          <p className="text-gray-700">
            If you are a researcher, student, or enthusiast who wants to create model gardens, please submit{" "} 
            <a href="https://forms.gle/uWByDVgzaiazxVJr9" className="font-bold text-primary">
              this interest form.
            </a>{" "}
            There is no cost or lengthy approval process, we just want to know who you are to prevent spam and ensure high quality gardens.
          </p>

          <p className="text-gray-700">
            If you have already been approved and are seeing this page, please email us at{" "}
            <a href="mailto:garden@teams.uchicago.edu" className="font-bold text-primary">
              garden@teams.uchicago.edu
            </a>{" "}
          </p>

          <div className="flex items-center justify-center space-x-4">
            <a 
              href="https://forms.gle/uWByDVgzaiazxVJr9" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Become a Gardener
            </a>
            <Button onClick={() => navigate("/")} className="font-bold">
              Back home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGardenPage;
