import { IpynbRenderer } from "react-ipynb-renderer";
import "../ipynbPreview.css";
import CopyButton from "./CopyButton";

type ExampleFunctionProps = {
  functionText: string;
};

export const ExampleFunction = ({ functionText }: ExampleFunctionProps) => {
  // break up functionText into lines
  const lines = functionText.split("\n").map((line) => line + "\n");
  const notebookJson = makeMinimalNotebook(lines);
  return (
    <div className="no-input-number relative px-4">
      <IpynbRenderer ipynb={notebookJson} />
      <CopyButton
        hint={"Copy Function Body"}
        content={functionText}
        className="absolute right-0 top-0 m-3 mr-16 border-none bg-transparent"
      />
    </div>
  );
};

function makeMinimalNotebook(code: Array<string>) {
  const notebook = {
    nbformat: 4,
    nbformat_minor: 2,
    metadata: {
      kernelspec: {
        name: "python3",
        display_name: "Python 3",
        language: "python",
      },
      language_info: {
        name: "python",
        version: "3.x",
        mimetype: "text/x-python",
        codemirror_mode: { name: "ipython", version: 3 },
        pygments_lexer: "ipython3",
        nbconvert_exporter: "python",
        file_extension: ".py",
      },
    },
    cells: [
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: code,
      },
    ],
  };
  return notebook;
}
