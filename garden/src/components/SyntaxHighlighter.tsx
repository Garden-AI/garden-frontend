import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import "./syntaxHighlighter.css";

SyntaxHighlighter.registerLanguage("python", python);

const SyntaxHighlighterComponent = ({ children, className }: { children: string; className?: string }) => {
  return (
    <SyntaxHighlighter 
      language={"python"} 
      useInlineStyles={false} 
      wrapLongLines
      className={className}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default SyntaxHighlighterComponent;
