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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

import { BookOpenIcon, CalendarIcon, TagIcon } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";

import SaveGardenButton from "../../gardens/components/SaveGardenButton";

export const SearchResult = ({ garden, verbose }: { garden: Garden; verbose: boolean }) => {
  const functions = [...(garden.entrypoints ?? []), ...(garden.modal_functions ?? [])];
  return (
    <Card className="transition-colors hover:bg-gray-50 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between space-x-3">
          <CardTitle className="line-clamp-2 text-xl font-bold transition-colors duration-300 hover:text-primary">
            <Link to={`/garden/${encodeURIComponent(garden.doi)}`}>{garden.title}</Link>
          </CardTitle>
          <div className="flex items-center space-x-1  text-gray-600">
            <SaveGardenButton garden={garden} />
          </div>
        </div>

        <Link
          className="mb-4 block cursor-pointer text-muted-foreground transition hover:underline"
          to={`/garden/${encodeURIComponent(garden.doi)}`}
        >
          DOI: {garden.doi}
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
      
      <MarkdownCardContent 
        className="line-clamp-3"
        content={garden.description || "*No description available*"}
      />
      
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
                  {functions?.map((func, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          className="font-semibold"
                          to={`/modal-functions/${encodeURIComponent(func.id)}`}
                        >
                          {func.title}
                        </Link>
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
                  ))}
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
