import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import LiveCodeBlock from './LiveCodeBlock';

// Custom components for MDX
const components = {
  // Handle code blocks in MDX
  pre: (props: any) => {
    // If the pre tag contains a code element, pass it to LiveCodeBlock
    if (props.children && props.children.props) {
      const {
        children,
        className = '',
        live,
        title,
        ...otherProps
      } = props.children.props;

      return (
        <LiveCodeBlock
          className={className}
          live={live}
          title={title}
          {...otherProps}
        >
          {children}
        </LiveCodeBlock>
      );
    }
    
    // Fallback for regular pre tags
    return <pre {...props} />;
  },
  
  // Also handle direct code blocks
  code: (props: any) => {
    const { className = '', children, live, title, ...otherProps } = props;
    
    // If it's an inline code element (no newlines), render as regular code
    if (typeof children === 'string' && !children.includes('\n')) {
      return <code className={className} {...otherProps}>{children}</code>;
    }
    
    // Otherwise, treat as a code block
    return (
      <LiveCodeBlock
        className={className}
        live={live}
        title={title}
        {...otherProps}
      >
        {children}
      </LiveCodeBlock>
    );
  },
};

interface CustomMDXProviderProps {
  children: React.ReactNode;
}

const CustomMDXProvider: React.FC<CustomMDXProviderProps> = ({ children }) => {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
};

export default CustomMDXProvider;