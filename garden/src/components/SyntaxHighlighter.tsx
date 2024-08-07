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
    <SyntaxHighlighter
      language={"python"}
      useInlineStyles={false}
      wrapLongLines
    >
      {children}
    </SyntaxHighlighter>
  );
}
