import Markdown from "marked-react";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { useGetNotebook } from "@/api/notebook";

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
    return (
      <p className="pb-16 pt-8 text-center text-xl">Loading notebook ...</p>
    );
  } else if (isError || !notebook) {
    return (
      <p className="pb-16 pt-8 text-center text-xl">Could not load notebook.</p>
    );
  } else if (!notebook) {
    return (
      <p className="pb-16 pt-8 text-center text-xl">Loading notebook ...</p>
    );
  }
  return (
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
  );
};
