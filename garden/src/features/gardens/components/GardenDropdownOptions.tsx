import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Archive, EllipsisVertical, Globe, Trash, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Input } from "@/components/shadcn/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Garden } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useDeleteGarden } from "../api/useDeleteGarden";
import { usePatchGarden } from "../api/usePatchGarden";

import { SUPER_USERS } from "@/utils/utils";

const GardenDropdownMenu = ({ garden }: { garden: Garden }) => {
  const auth = useGlobusAuth();

  const [isPublishGardenModalOpen, setIsPublishGardenModalOpen] = React.useState(false);
  const [isDeleteGardenModalOpen, setIsDeleteGardenModalOpen] = React.useState(false);
  const [isArchiveGardenModalOpen, setIsArchiveGardenModalOpen] = React.useState(false);

  const isSuperUser = SUPER_USERS.includes(auth.authorization?.user?.sub);
  if ((!auth.isAuthenticated || garden.owner_identity_id !== auth.authorization?.user?.sub) && !isSuperUser) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <EllipsisVertical className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {garden.doi_is_draft ? (
            <>
              <DropdownMenuItem onSelect={() => setIsPublishGardenModalOpen(true)}>
                <Globe className="mr-2 h-5 w-5" />
                <span className="">Register Garden DOI</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => setIsDeleteGardenModalOpen(true)}
                className="text-red-800 hover:text-red-600"
              >
                <Trash className="mr-2 h-5 w-5" />
                <span className="">Delete Garden</span>
              </DropdownMenuItem>
            </>
          ) : garden.is_archived ? (
            <DropdownMenuItem onSelect={() => setIsPublishGardenModalOpen(true)}>
              <Globe className="mr-2 h-5 w-5" />
              <span className="">Make Garden Visible</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => setIsArchiveGardenModalOpen(true)}
              className="text-red-800 hover:text-red-600"
            >
              <Archive className="mr-2 h-5 w-5" />
              <span className="">Archive Garden</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PublishGardenModal
        isOpen={isPublishGardenModalOpen}
        setIsOpen={setIsPublishGardenModalOpen}
        garden={garden}
      />

      <DeleteGardenModal
        garden={garden}
        isOpen={isDeleteGardenModalOpen}
        setIsOpen={setIsDeleteGardenModalOpen}
      />

      <ArchiveGardenModal
        garden={garden}
        isOpen={isArchiveGardenModalOpen}
        setIsOpen={setIsArchiveGardenModalOpen}
      />
    </>
  );
};

const LoadingOverlay = () => {
  return (
    <div className="no-doc-scroll fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
      <LoadingSpinner />
    </div>
  );
};

export const PublishGardenModal = ({
  garden,
  isOpen,
  setIsOpen,
}: {
  garden: Garden;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [input, setInput] = React.useState("");
  const queryClient = useQueryClient();
  const { mutate: updateGarden, isPending } = usePatchGarden();

  const doi = garden.doi;

  const handleRegisterGardenDOI = async () => {
    await updateGarden({
      doi: doi,
      garden: {
        doi_is_draft: false,
      },
      successMessage: "Garden DOI registered successfully!"
    });
    setIsOpen(false);
    setInput("");
    queryClient.invalidateQueries({ queryKey: ["search"] });
    queryClient.setQueryData(["garden", doi], (oldData: Garden) => {
      return { ...oldData, doi_is_draft: false, is_archived: false };
    });
    setIsOpen(false);
    toast.error("Error publishing garden. Please try again later.");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Register Garden DOI</AlertDialogTitle>
          <AlertDialogDescription className="pb-4">
            Register your garden's DOI to make it citable.
          </AlertDialogDescription>
          <Alert className="my-4 rounded-lg border-yellow-200 bg-yellow-50 p-4 text-yellow-800 shadow-md">
            <div className="mb-2 flex items-center space-x-2">
              <TriangleAlert className="mb-1 h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-lg font-semibold">Heads up!</AlertTitle>
            </div>
            <AlertDescription className="space-y-4">
              <ul className="list-disc space-y-1 pl-5">
                <li>This will make your Garden's DOI findable on doi.org.</li>
                <li>Gardens with registered DOIs can be archived (hidden) but not deleted.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <p className="pt-3 text-sm">
            Please type
            <span className="font-semibold"> register {doi} </span>to confirm:
          </p>
          <div className=" mb-4">
            <Input
              type="text"
              className="mt-2 w-full rounded border border-gray-300 p-2"
              placeholder={`register ${doi}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRegisterGardenDOI}
            disabled={isPending || input !== `register ${doi}`}
            className="bg-primary hover:bg-primary/60"
          >
            I understand, register DOI for this Garden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

      {isPending && <LoadingOverlay />}
    </AlertDialog>
  );
};

const DeleteGardenModal = ({
  garden,
  isOpen,
  setIsOpen,
}: {
  garden: Garden;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [input, setInput] = React.useState("");
  const navigate = useNavigate();

  const { mutate: deleteGarden, isPending } = useDeleteGarden();
  const doi = garden.doi;

  const handleDeleteGarden = () => {
    deleteGarden(doi, {
      onSuccess: () => {
        setIsOpen(false);
        setInput("");
        navigate("/");
        toast.success("Garden deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["search"] });
        queryClient.removeQueries({ queryKey: ["garden", doi] });
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Garden</AlertDialogTitle>
          <AlertDialogDescription className="pb-3">
            Are you sure you want to delete this garden?
          </AlertDialogDescription>
          <Alert className=" rounded-lg border-red-200 bg-red-50 p-4 text-red-800 shadow-md">
            <div className="mb-2 flex items-center space-x-2">
              <TriangleAlert className="mb-1 h-5 w-5 text-red-600" />
              <AlertTitle className="text-lg font-semibold">Heads up!</AlertTitle>
            </div>
            <AlertDescription className="space-y-4">
              <ul className="list-disc space-y-1 pl-5">
                <li>This will permanently delete your Garden and all its contents.</li>
                <li>Deleted gardens cannot be recovered. Please be sure before proceeding.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <p className="pt-2 text-sm">
            Please type
            <span className="font-semibold"> delete {doi} </span>to confirm:
          </p>
          <div>
            <Input
              type="text"
              className="mt-2 w-full rounded border border-gray-300 p-2"
              placeholder={`delete ${doi}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteGarden}
            disabled={isPending || input !== `delete ${doi}`}
            className="bg-red-600 hover:bg-red-700"
          >
            I understand, delete Garden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      {isPending && <LoadingOverlay />}
    </AlertDialog>
  );
};

const ArchiveGardenModal = ({
  garden,
  isOpen,
  setIsOpen,
}: {
  garden: Garden;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const { mutate: updateGarden, isPending } = usePatchGarden();
  const [input, setInput] = React.useState("");
  const doi = garden.doi;

  const handleArchiveGarden = () => {
    updateGarden(
      {
        doi: doi,
        garden: {
          doi_is_draft: false,
          is_archived: true,
        },
        successMessage: "Garden archived successfully!",
      },
    );

    setInput("");
    queryClient.invalidateQueries({ queryKey: ["search"] });
    queryClient.setQueryData(["garden", doi], (oldData: Garden) => {
      return { ...oldData, is_archived: true };
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Garden</AlertDialogTitle>
          <AlertDialogDescription className="pb-3">
            Are you sure you want to archive this garden?
          </AlertDialogDescription>
          <Alert className="rounded-lg border-yellow-200 bg-yellow-50 p-4 text-yellow-800 shadow-md">
            <div className="mb-2 flex items-center space-x-2">
              <Archive className="mb-1 h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-lg font-semibold">Heads up!</AlertTitle>
            </div>
            <AlertDescription className="space-y-4">
              <ul className="list-disc space-y-1 pl-5">
                <li>This will hide your Garden from public view.</li>
                <li>Archived gardens can be published again but not deleted.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <p className="pt-3 text-sm">
            Please type
            <span className="font-semibold"> archive {doi} </span>to confirm:
          </p>
          <div>
            <Input
              type="text"
              className="mt-2 w-full rounded border border-gray-300 p-2"
              placeholder={`archive ${doi}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchiveGarden}
            disabled={isPending || input !== `archive ${doi}`}
            className="bg-red-600 hover:bg-red-700"
          >
            I understand, archive Garden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      {isPending && <LoadingOverlay />}
    </AlertDialog>
  );
};

export default GardenDropdownMenu;
