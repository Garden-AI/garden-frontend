import Markdown from "marked-react";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { useGetNotebook } from "@/api";
import LoadingSpinner from "./LoadingSpinner";

export const NotebookViewer = ({ notebookURL }: { notebookURL: string }) => {
  if (!notebookURL) {
    return (
      <p className="pb-16 pt-8 text-center text-xl">
        No notebook for this entrypoint.
      </p>
    );
  }

  const { data: notebook, isLoading, isError } = useGetNotebook(notebookURL);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !notebook) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Invalid Notebook
        </h2>
        <p className="mt-2 text-gray-600">
          This entrypoint's notebook is invalid or missing.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className=" py-8">
        <p className="text-gray-700">
          This notebook contains the definition of this entrypoint, tagged with
          @garden_entrypoint. <br />
          When you execute the entrypoint, it runs in a Python session created
          by running every cell in this notebook once.
        </p>
      </div>
      <div className="prose prose-sm mx-auto mt-20 lg:prose-base 2xl:prose-xl">
        {notebook.cells
          .slice(2, notebook.cells.length)
          .map(
            (cell, index) =>
              cell.source.length > 0 &&
              (cell.cell_type === "code" ? (
                <SyntaxHighlighter key={index}>
                  {cell.source.join("")}
                </SyntaxHighlighter>
              ) : (
                <Markdown key={index}>{cell.source.join("")}</Markdown>
              )),
          )}
      </div>
    </>
  );
};
