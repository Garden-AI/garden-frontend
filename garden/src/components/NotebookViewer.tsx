import { useEffect, useState } from "react";
import { IpynbRenderer } from "react-ipynb-renderer";
import "../ipynbPreview.css";

type NotebookViewerProps = {
  notebookURL: string;
};

export const NotebookViewer = ({ notebookURL }: NotebookViewerProps) => {
  const [notebookJson, setNotebookJson] = useState<any>(null);
  const [loadingError, setLoadingError] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(notebookURL);
        const json = await response.json();
        setNotebookJson(json);
      } catch (error) {
        console.error("Error fetching notebook:", error);
        setLoadingError(true);
      }
    };

    fetchNotebook();
  }, [notebookURL]);

  if (notebookJson) {
    return <IpynbRenderer ipynb={notebookJson} />;
  } else if (loadingError) {
    return (
      <p className="pb-16 pt-8 text-center text-xl">Could not load notebook</p>
    );
  }
  // No error and no notebook yet, so we're still loading
  return <p className="pb-16 pt-8 text-center text-xl">Loading notebook ...</p>;
};
