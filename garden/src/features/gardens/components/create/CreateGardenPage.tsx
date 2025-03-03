import { CreateGardenForm } from "./CreateGardenForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetGlobusGroups } from "../../api/useGetGlobusGroups";

const CreateGardenPage = () => {

  const { data: groups } = useGetGlobusGroups();

  if (
    !groups?.find((group) => group.id === import.meta.env.VITE_GLOBUS_GROUP_UUID)
  )
    return <GlobusGroupError />;

  return (
    <div className="mx-auto max-w-6xl px-8 py-16 font-display">
      <CreateGardenFormHeader />
      <CreateGardenForm />
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
        <div className="space-y-12 text-center">
          <h1 className="text-4xl font-bold">Globus Group Required</h1>
          <p className="text-gray-700">
            You must be a part of the publishing Globus Group to publish a Garden via a Modal App. Please email{" "}
            <a href="mailto:willengler@uchicago.edu" className="font-bold text-primary">
              Will Engler (willengler@uchicago.edu)
            </a>{" "}
            or{" "}
            <a href="mailto:owenpriceskelly@uchicago.edu" className="font-bold text-primary">
              Owen Price Skelly (owenpriceskelly@uchicago.edu)
            </a>{" "} to be added to the group. Include the email address linked to your Globus account.
          </p>
          <p className="text-gray-700">
            If you are already a member of the group and are seeing this message, please try logging out and logging back in.
          </p>
          <div className=" flex items-center justify-center space-x-4">
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
