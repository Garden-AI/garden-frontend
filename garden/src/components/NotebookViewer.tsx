import Markdown from "marked-react";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "./SyntaxHighlighter";

interface Cell {
  cell_type: string;
  execution_count: number;
  metadata: any;
  outputs: Array<any>;
  source: Array<any>;
}
interface Notebook {
  cells: Array<Cell>;
}
export const NotebookViewer = ({ notebookURL }: { notebookURL: string }) => {
  const [notebook, setNotebook] = useState<Notebook>();
  const [loadingError, setLoadingError] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(notebookURL);
        const json = await response.json();
        setNotebook(json);
      } catch (error) {
        console.error("Error fetching notebook:", error);
        setLoadingError(true);
      }
    };

    fetchNotebook();
  }, [notebookURL]);

  if (loadingError) {
    return (
      <p className="pb-16 pt-8 text-center text-xl">Could not load notebook.</p>
    );
  } else if (!notebook) {
    return (
      <p className="pb-16 pt-8 text-center text-xl">Loading notebook ...</p>
    );
  } else {
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
  }
};
