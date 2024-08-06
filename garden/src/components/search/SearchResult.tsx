import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "../ui/badge";
import { BookOpenIcon, CalendarIcon, TagIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PersonIcon } from "@radix-ui/react-icons";

import { Garden } from "@/api/types";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

export const SearchResult = ({
  garden,
  verbose,
}: {
  garden: Garden;
  verbose: boolean;
}) => {
  return (
    <Card className="transition-colors hover:bg-gray-50 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl  font-bold transition-colors duration-300 hover:text-primary">
          <Link to={`/garden/${encodeURIComponent(garden.doi)}`}>
            {garden.title}
          </Link>
        </CardTitle>

        <Link
          className="mb-4 block cursor-pointer text-muted-foreground  transition hover:underline"
          to={`/garden/${encodeURIComponent(garden.doi)}`}
        >
          DOI: {garden.doi}
        </Link>

        <CardDescription className="flex items-center space-x-2  text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{garden.year}</span>
          <BookOpenIcon className="ml-2 h-4 w-4" />
          <span>
            {garden.entrypoints?.length} entrypoint
            {garden.entrypoints?.length !== 1 && <span>s</span>}
          </span>{" "}
          <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6 line-clamp-3  text-gray-700">
          {garden.description || (
            <span className="italic">No description available </span>
          )}
        </p>
        {verbose && garden.entrypoints && garden.entrypoints.length > 0 && (
          <div>
            <h3 className="pb-4 font-semibold">Entrypoints</h3>

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
                  {garden.entrypoints?.map((entrypoint, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          className="font-semibold "
                          to={`/entrypoint/${encodeURIComponent(entrypoint.doi)}`}
                        >
                          {entrypoint.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-3">{entrypoint.description}</p>
                      </TableCell>
                      <TableCell>
                        {entrypoint.tags?.map((tag, index) => (
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
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
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
            <TagIcon
              className="mt-1 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
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
