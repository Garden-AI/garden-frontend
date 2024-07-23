import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import "../syntaxHighlighter.css";

SyntaxHighlighter.registerLanguage("python", python);

export default function SyntaxHighlighterComponent({
  children,
}: {
  children: string;
}) {
  return (
    <div className="text-xs md:text-base 2xl:text-lg">
      <SyntaxHighlighter language={"python"} useInlineStyles={false}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}