import MarkedReact from 'marked-react';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown = ({ content, className = '' }: MarkdownProps) => {
  return (
    <div className={`prose prose-sm prose-gray max-w-none ${className}`}>
      <MarkedReact>{content}</MarkedReact>
    </div>
  );
};

export default Markdown; 