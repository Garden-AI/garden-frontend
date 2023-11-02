import { IpynbRenderer } from "react-ipynb-renderer";
import "react-ipynb-renderer/dist/styles/monokai.css";

type NotebookViewerProps = {
  notebookJson: any;
};

export const NotebookViewer = ({notebookJson}: NotebookViewerProps) => {
  return (
    <IpynbRenderer
      ipynb={notebookJson}
    />
  );
};