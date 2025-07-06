import React from 'react';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, ...props }) => {
  return (
    <pre className={className} {...props}>
      <code>{children}</code>
    </pre>
  );
};

export default CodeBlock;