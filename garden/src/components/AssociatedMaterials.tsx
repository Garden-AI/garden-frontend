import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Entrypoint } from "../types";
import { BookOpen, Paperclip } from "lucide-react";
import CopyButton from "./CopyButton";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function AssociatedMaterials({ entrypoint }: { entrypoint: Entrypoint }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="mb-10 border-y"
      defaultValue="materials"
    >
      <AccordionItem value="materials">
        <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
          <div className="flex items-center gap-x-2 p-2">
            <Paperclip className="text-gray-500" />
            <span className="font-medium text-gray-700">
              Associated Materials
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 gap-4 py-6 lg:grid-cols-2">
          {entrypoint.papers?.length + entrypoint.repositories?.length > 0 ? (
            <>
              {entrypoint.papers.map((paper) => (
                <div key={paper.doi} className="rounded-md border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="grid grid-cols-12 items-center gap-2">
                      <BookOpen className="col-span-1 hidden h-6 w-6 text-gray-600 sm:block" />

                      <div className="col-span-11">
                        <Link
                          to={`https://doi.org/${paper.doi}`}
                          className="text-lg font-bold text-gray-800 transition-colors duration-300 hover:text-gray-600"
                        >
                          {paper.title}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Authors:</span>{" "}
                    {paper.authors.join(", ")}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">DOI:</span> {paper.doi}
                    <CopyButton
                      content={paper.doi}
                      hint="Copy DOI"
                      className=""
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Copy Citation</span>
                    <CopyButton
                      content={paper.citation}
                      hint="Copy Citation"
                      className=""
                    />
                  </div>
                </div>
              ))}
              {entrypoint.repositories.map(
                ({ repo_name, contributors, url }, index) => (
                  <div
                    key={index}
                    className="flex min-h-[300px] flex-col justify-between rounded-md border bg-white p-6"
                  >
                    <div className="">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1">
                          <img
                            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            alt="GitHub Logo"
                            className="h-8 w-8"
                          />
                          <Link
                            to={url}
                            className="text-lg font-bold text-gray-800 transition-colors duration-300 hover:text-gray-600"
                          >
                            {repo_name}
                          </Link>
                        </div>
                      </div>
                      {contributors.length > 0 && (
                        <div className="mb-4 text-sm text-gray-600">
                          <span className="font-medium">Contributors:</span>{" "}
                          {contributors.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <p>Copy Link</p>
                        <CopyButton
                          content={url}
                          hint="Copy Repository URL"
                          className=""
                        />
                      </div>
                      <Button
                        variant={"secondary"}
                        className="mb-2 text-sm text-gray-600"
                        asChild
                      >
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          Visit Repository
                        </a>
                      </Button>
                    </div>
                  </div>
                ),
              )}
            </>
          ) : (
            <div className="rounded-md bg-white p-6">
              <p className="text-base text-gray-800 ">
                No associated materials available
              </p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default AssociatedMaterials;
