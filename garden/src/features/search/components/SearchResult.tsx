import { useState } from "react";
import { Link } from "react-router-dom";
import { Garden } from "@/types";
import { Badge } from "@/components/shadcn/badge";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  MarkdownCardContent,
} from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/shadcn/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

import { BookOpenIcon, CalendarIcon, TagIcon } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";

import SaveGardenButton from "../../gardens/components/SaveGardenButton";
import { ShareGardenButton } from "../../gardens/components/ShareGardenButton";
import { Button } from "@/components/shadcn/button";
import { toast } from "sonner";

export const SearchResult = ({
  garden,
  verbose,
  showPublishedBanner = true,
}: {
  garden: Garden;
  verbose: boolean;
  showPublishedBanner?: boolean;
}) => {
  const functions = [
    ...(garden.entrypoints ?? []),
    ...(garden.modal_functions ?? []),
    ...(garden.hpc_functions ?? []),
  ];
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <Card
      className={`relative transition-colors hover:shadow-lg ${garden.is_archived ? "bg-gray-100" : "hover:bg-gray-50"}`}
    >
      <CardHeader
        className={`${showPublishedBanner || garden.is_archived || garden.doi_is_draft ? "pt-8" : ""}`}
      >
        {showPublishedBanner && (
          <div
            style={{ backgroundColor: "#C2E6CA", color: "#11451F" }}
            className="absolute left-0 top-0 w-full rounded-t-md px-4 py-1 text-center text-sm font-semibold shadow-sm"
          >
            Published
          </div>
        )}
        <div className="flex items-start justify-between space-x-3">
          {garden.is_archived && (
            <div
              style={{ backgroundColor: "#D2D1F7", color: "#3C2F67" }}
              className="absolute left-0 top-0 w-full rounded-t-md px-4 py-1 text-center text-sm font-semibold shadow-sm"
            >
              Archived
            </div>
          )}
          {garden.doi_is_draft && (
            <div
              style={{ backgroundColor: "#DBE9FF", color: "#28487B" }}
              className="absolute left-0 top-0 w-full rounded-t-md px-4 py-1 text-center text-sm font-semibold shadow-sm"
            >
              Draft
            </div>
          )}
          <CardTitle className="line-clamp-2 text-xl font-bold transition-colors duration-300 hover:text-primary">
            <Link to={`/garden/${encodeURIComponent(garden.doi)}`}>{garden.title}</Link>
          </CardTitle>
          <div className="flex items-center space-x-1  text-gray-600">
            <SaveGardenButton garden={garden} />
            <ShareGardenButton garden={garden} />
          </div>
        </div>

        <Link
          className="mb-4 block cursor-pointer text-muted-foreground transition hover:underline"
          to={`/garden/${encodeURIComponent(garden.doi)}`}
        >
          DOI: {garden.doi}
          {garden.marked_for_deletion && garden.doi_is_draft && (
            <div
              style={{ backgroundColor: "#F0C2BD", color: "#411528" }}
              className="ml-2 inline-block rounded px-2 py-0.5 text-xs font-medium"
            >
              Marked for Deletion
            </div>
          )}
        </Link>

        <CardDescription className="flex items-center space-x-2 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{garden.year}</span>
          <BookOpenIcon className="ml-2 h-4 w-4" />
          <span>
            {functions?.length} function
            {functions?.length !== 1 && <span>s</span>}
          </span>
        </CardDescription>
      </CardHeader>

      <div className="p-1">
        <MarkdownCardContent
          className={`text-balanced m-2 p-2 ${showMore ? "" : "line-clamp-3"}`}
          content={garden.description || "*No description available*"}
        />
        <Button
          onClick={handleShowMore}
          className="bg-inherit text-xs text-black hover:bg-inherit hover:text-blue-400 hover:underline"
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>

      {verbose && functions?.length > 0 && (
        <CardContent>
          <div>
            <h3 className="pb-4 font-semibold">Functions</h3>
            <ScrollArea className="h-[250px] rounded border p-2">
              <Table className="relative w-full">
                <TableHeader className="sticky top-0 font-semibold">
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Tags</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {functions?.map((func, index) => {
                    // Check if this is an HPC function by seeing if it's in the hpc_functions array
                    const isHpcFunction = garden.hpc_functions?.some((hpc) => hpc.id === func.id);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {isHpcFunction ? (
                            <Link
                              className="font-semibold"
                              to={`/hpc-functions/${encodeURIComponent(func.id)}`}
                            >
                              {func.title}
                            </Link>
                          ) : (
                            <Link
                              className="font-semibold"
                              to={`/modal-functions/${encodeURIComponent(func.id)}`}
                            >
                              {func.title}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-3">{func.description}</p>
                        </TableCell>
                        <TableCell>
                          {func.tags?.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-default whitespace-nowrap bg-primary font-thin capitalize text-primary-foreground transition-colors hover:bg-primary/70"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      )}
      <CardFooter className="flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <PersonIcon className="mr-1 h-5 w-5" />
          {garden.authors?.slice(0, 5).map((author, index) => (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={50}>
                <TooltipTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{author}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {garden.authors && garden.authors.length > 5 && (
            <Badge variant="secondary">+{garden.authors.length - 5}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {garden.tags && garden.tags.length > 0 && (
            <TagIcon className="mt-1 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          )}
          <div className="flex flex-wrap items-center gap-0.5">
            {garden.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-default bg-primary font-thin capitalize text-primary-foreground transition-colors hover:bg-primary/70"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
