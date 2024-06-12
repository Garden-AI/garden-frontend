import SyntaxHighlighter from "./SyntaxHighlighter";

type ExampleFunctionProps = {
  functionText: string;
};

export const ExampleFunction = ({ functionText }: ExampleFunctionProps) => {
  return <SyntaxHighlighter>{functionText}</SyntaxHighlighter>;
};
