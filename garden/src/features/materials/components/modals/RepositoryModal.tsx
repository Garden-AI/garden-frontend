import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import { Link, Loader2 } from "lucide-react";
import MultipleSelector from "@/components/shadcn/multiple-select";
import { Repository } from "@/types";
import { repositorySchema, RepositoryFormData } from "../../types/material.types";
import { extractGitHubInfo, fetchGitHubMetadata } from "../../utils/github";
import { toast } from "sonner";
import { Textarea } from "@/components/shadcn/textarea";

interface RepositoryModalProps {
  edit?: boolean;
  index?: number;
  onSave: (data: Repository) => void;
  initialData?: Repository;
  trigger: React.ReactNode;
}

const RepositoryModal = ({ edit, onSave, initialData, trigger }: RepositoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");

  const form = useForm<RepositoryFormData>({
    resolver: zodResolver(repositorySchema),
    defaultValues: {
      repo_name: initialData?.repo_name || "",
      url: initialData?.url || "",
      contributors:
        initialData?.contributors?.map((contributor) => ({
          value: contributor,
          label: contributor,
        })) || [],
      license: initialData?.license as string || "",
      version: initialData?.version as string || "",
      description: initialData?.description as string || "",
    },
  });

  const url = form.watch("url");

  // Reset form when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      // If we're editing, load the initial data
      if (edit && initialData) {
        form.reset({
          repo_name: initialData.repo_name || "",
          url: initialData.url || "",
          contributors:
            initialData.contributors?.map((contributor) => ({
              value: contributor,
              label: contributor,
            })) || [],
          license: initialData.license as string || "",
          version: initialData.version as string || "",
          description: initialData.description as string || "",
        });
      } else {
        // If we're adding a new repository, reset to empty values
        form.reset({
          repo_name: "",
          url: "",
          contributors: [],
          license: "",
          version: "",
          description: "",
        });
      }
      setPreviousUrl("");
    }
  }, [isOpen, edit, initialData, form]);

  // Auto-populate repository metadata when URL changes
  useEffect(() => {
    const fetchGitHubData = async (owner: string, repo: string, ref?: string) => {
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchGitHubMetadata(owner, repo, ref);
        
        let fieldsUpdated = false;
        
        // Only auto-fill empty fields
        if (metadata.repo_name && !form.getValues("repo_name")) {
          form.setValue("repo_name", metadata.repo_name);
          fieldsUpdated = true;
        }
        
        // Check if contributors field is empty
        const currentContributors = form.getValues("contributors");
        const isContributorsEmpty = !currentContributors || currentContributors.length === 0;
        
        if (metadata.contributors && metadata.contributors.length > 0 && isContributorsEmpty) {
          form.setValue(
            "contributors",
            metadata.contributors.map((contributor) => ({
              value: contributor,
              label: contributor,
            }))
          );
          fieldsUpdated = true;
        }

        // Set license if available and field is empty
        if (metadata.license && !form.getValues("license")) {
          form.setValue("license", metadata.license);
          fieldsUpdated = true;
        }

        // Set version if available and field is empty
        if (metadata.version && !form.getValues("version")) {
          form.setValue("version", metadata.version);
          fieldsUpdated = true;
        }

        // Set description if available and field is empty
        if (metadata.description && !form.getValues("description")) {
          form.setValue("description", metadata.description);
          fieldsUpdated = true;
        }
        
        if (fieldsUpdated) {
          toast.success("Repository metadata auto-filled from GitHub");
        }
      } catch (error) {
        console.error("Error fetching GitHub metadata:", error);
        toast.error("Failed to fetch repository metadata from GitHub");
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    // Check if URL is a GitHub link and different from the previous one
    if (url && url !== previousUrl) {
      setPreviousUrl(url);
      const githubInfo = extractGitHubInfo(url);
      if (githubInfo) {
        fetchGitHubData(githubInfo.owner, githubInfo.repo, githubInfo.ref);
      }
    }
  }, [url, form, previousUrl]);

  const handleSave = (data: RepositoryFormData) => {
    onSave({
      ...data,
      contributors: data.contributors?.map((contributor) => contributor.value),
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Repository" : "Add New Repository"}</DialogTitle>
          <DialogDescription>
            {edit
              ? "Make changes to your repository here."
              : "Enter the details of your repository here."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <div className="flex relative">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        <Link className="h-4 w-4" />
                      </span>
                      <Input 
                        className="rounded-l-none" 
                        placeholder="Repository URL" 
                        {...field} 
                      />
                      {isLoadingMetadata && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Paste a GitHub repository link to auto-fill repository details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repo_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Repository Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License</FormLabel>
                    <FormControl>
                      <Input placeholder="MIT, Apache-2.0, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version/Commit</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0.0, main, commit hash" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Repository description" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contributors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contributors</FormLabel>
                  <FormControl>
                    <MultipleSelector creatable {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" onClick={form.handleSubmit(handleSave)}>
                {edit ? "Save Changes" : "Add Repository"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { RepositoryModal };
