import SyntaxHighlighter from "@/components/SyntaxHighlighter";

type ExampleFunctionProps = {
  functionText: string;
};

export const ExampleFunction = ({ functionText }: ExampleFunctionProps) => {
  return (
    <div className="text-xs md:text-base 2xl:text-lg">
      <SyntaxHighlighter>{functionText}</SyntaxHighlighter>
    </div>
  );
};
