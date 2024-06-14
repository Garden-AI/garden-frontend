import { IpynbRenderer } from "react-ipynb-renderer";
import "../ipynbPreview.css";
import { useGetNotebook } from "../api/notebook";

export const NotebookViewer = ({ notebookURL }: { notebookURL?: string }) => {
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
      <p className="pb-16 pt-8 text-center text-xl">Could not load notebook</p>
    );
  } else {
    return (
      <div className="overflow-x-auto">
        <IpynbRenderer ipynb={notebook} />
      </div>
    );
  }
};
