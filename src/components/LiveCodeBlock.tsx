import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Highlight } from 'prism-react-renderer';

interface LiveCodeBlockProps {
  children: string;
  className?: string;
  live?: boolean;
  title?: string;
}

const LiveCodeBlock: React.FC<LiveCodeBlockProps> = ({
  children,
  className = '',
  live = false,
  title
}) => {
  // Extract language from className (e.g., "language-javascript")
  const language = className.replace(/language-/, '');
  
  // Check if this should be a live code block
  const isLive = live || language === 'react-live' || className.includes('react-live');
  
  if (isLive) {
    // Create the scope for React Live - include React and common components
    const scope = {
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      // Add any other components/utilities you want available in live code
    };
    
    return (
      <div style={{ marginBottom: '2rem' }}>
        {title && (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '0.5rem 1rem',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: '#374151'
          }}>
            {title}
          </div>
        )}
        <LiveProvider code={children.trim()} scope={scope} theme={undefined}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            border: '1px solid #e5e5e5',
            borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem'
          }}>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                Preview
              </h4>
              <LivePreview style={{ 
                minHeight: '100px',
                padding: '1rem',
                border: '1px solid #e5e5e5',
                borderRadius: '0.25rem',
                background: '#fafafa'
              }} />
              <LiveError style={{ 
                color: '#dc2626',
                background: '#fee2e2',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }} />
            </div>
            <div style={{ background: '#f8f9fa' }}>
              <h4 style={{ 
                margin: '0',
                padding: '1rem 1rem 0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                Edit Code
              </h4>
              <LiveEditor style={{ 
                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                fontSize: '0.875rem',
                minHeight: '150px'
              }} />
            </div>
          </div>
        </LiveProvider>
      </div>
    );
  }

  // Regular syntax highlighting for non-live code blocks
  return (
    <Highlight code={children.trim()} language={language as any}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre 
          className={className} 
          style={{ 
            ...style, 
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default LiveCodeBlock;