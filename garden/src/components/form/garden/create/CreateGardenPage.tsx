import { Separator } from "@/components/ui/separator";
import { CreateGardenForm } from "./CreateGardenForm";
import Breadcrumb from "@/components/Breadcrumb";

export default function CreateGardenPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-16 font-display">
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: "Gardens", link: "/search" },
          { label: "Create Garden" },
        ]}
      />
      <CreateGardenFormHeader />
      <CreateGardenForm />
    </div>
  );
}

const CreateGardenFormHeader = () => {
  return (
    <>
      <div className="mb-4 flex items-center space-x-8">
        <div className="relative h-96 w-96 flex-shrink-0">
          <img
            src="img/AIGeneratedImg.png"
            alt="Garden AI Logo"
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="flex-grow space-y-4">
          <h1 className="text-4xl font-light">Create a Garden</h1>
          <p className="text-sm text-gray-700">
            Gardens collect and organize Entrypoints, making it easy for others to discover and use
            your work.
          </p>
          <p className="text-sm text-gray-700">
            Start by giving your Garden a title and description, and one or more entrypoints.
          </p>
        </div>
      </div>

      <Separator className="mb-8" />
    </>
  );
};
