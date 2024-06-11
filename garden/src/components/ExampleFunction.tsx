import SyntaxHighlighter from "./SyntaxHighlighter";

type ExampleFunctionProps = {
  functionText: string;
};

export const ExampleFunction = ({ functionText }: ExampleFunctionProps) => {
  return (
    <div className="no-input-number px-4">
      <SyntaxHighlighter>{functionText}</SyntaxHighlighter>
    </div>
  );
};
