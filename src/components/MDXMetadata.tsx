import React from 'react';
import { MDXMetadataItem } from '../types';

interface MDXMetadataProps {
  items: MDXMetadataItem[];
}

const MDXMetadata: React.FC<MDXMetadataProps> = ({ items }) => {
  return (
    <div className="mdx-metadata">
      {items.map((item, index) => (
        <div key={index} className={`metadata-${item.name}`}>
          <span className="metadata-label">{item.name}:</span>
          <span className="metadata-value">{item.data}</span>
        </div>
      ))}
    </div>
  );
};

export default MDXMetadata;