import * as React from "react";
import {
  Edit,
  EllipsisVertical,
  Globe,
  Link,
  Terminal,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteGarden, useUpdateDOI } from "@/api";
import { Input } from "./ui/input";
import { useGlobusAuth } from "./auth/useGlobusAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Garden } from "@/api/types";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Separator } from "./ui/separator";

export default function GardenDropdownMenu({ garden }: { garden: Garden }) {
  const auth = useGlobusAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const { mutate: updateDOI, isPending } = useUpdateDOI();
  const [input, setInput] = React.useState("");

  const doi = garden.doi;

  if (
    !auth.isAuthenticated ||
    garden.owner_identity_id !== auth.authorization?.user?.sub
  ) {
    return null;
  }
  const handlePublishGarden = () => {
    const body = {
      data: {
        type: "dois" as const,
        attributes: {
          event: "publish" as const,
          url: `https://gardens.ai/garden/${encodeURIComponent(doi)}`,
          identifiers: [
            {
              identifier: doi,
              identifierType: "DOI",
            },
          ],
        },
      },
    };
    updateDOI(body, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.success("Garden published successfully!");
        // queryClient.invalidateQueries({ queryKey: ["search"] });
        // queryClient.setQueryData(["garden", doi], null);
        // navigate("/");
      },
      // onError: (error) => {
      //   toast.error("There was an error deleting the garden.");
      //   setIsDeleteModalOpen(false);
      // },
    });
  };

  if (isPending) {
    return <LoadingOverlay />;
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
          <DropdownMenuItem
            onSelect={() => setIsDeleteModalOpen(true)}
            className="text-blue-800 hover:text-blue-600"
          >
            <Globe className="mr-2 h-5 w-5" />
            <span className="">Publish Garden</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Garden</AlertDialogTitle>
            <AlertDialogDescription className="mb-6">
              Publish your garden to make it findable on the web.
            </AlertDialogDescription>
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc">
                  <li>
                    This will make your Garden public and available to everyone.
                  </li>
                  <li>
                    Published gardens can be archived (hidden) but not deleted.
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <Separator className="my-4" />
            <p className="text-sm">
              Please type
              <span className="font-semibold"> publish {doi} </span>to confirm:
            </p>
            <div>
              <Input
                type="text"
                className="mt-2 w-full rounded border border-gray-300 p-2"
                placeholder={`publish ${doi}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  return false;
                }}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishGarden}
              disabled={isPending || input !== `publish ${doi}`}
              className="bg-blue-600 hover:bg-blue-700"
            >
              I understand, publish Garden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const LoadingOverlay = () => {
  return (
    <div className="no-doc-scroll fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
      <LoadingSpinner />
    </div>
  );
};
