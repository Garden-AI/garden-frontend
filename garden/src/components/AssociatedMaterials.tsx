import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Entrypoint } from "../types";
import { Paperclip } from "lucide-react";
import CopyButton from "./CopyButton";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function AssociatedMaterials({ entrypoint }: { entrypoint: Entrypoint }) {
  if (entrypoint.papers?.length == 0) return null;
  return (
    <Accordion
      type="single"
      collapsible
      className="mb-20"
      defaultValue="materials"
    >
      <AccordionItem value="materials">
        <AccordionTrigger className="rounded-md bg-gray-50 px-4 py-2  transition-colors duration-200 hover:bg-gray-100">
          <div className="flex items-center gap-x-2 p-2">
            <Paperclip className="text-gray-500" />
            <span className="font-medium text-gray-700">
              Associated Materials
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className=" space-y-4">
          {entrypoint?.papers?.map((paper) => (
            <div key={paper.doi} className="rounded-md bg-white p-4 shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <Link
                  to={`https://doi.org/${paper.doi}`}
                  className="text-lg font-bold text-gray-800 transition duration-300 hover:text-primary"
                >
                  {paper.title}
                </Link>

                <CopyButton content={paper.citation} hint="Copy Citation" />
              </div>
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium">Authors:</span>{" "}
                {paper.authors.join(", ")}
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default AssociatedMaterials;
