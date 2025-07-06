import React from 'react';
import * as styles from './TableOfContents.module.scss';

interface HeadingData {
  id: string;
  value: string;
  depth: number;
}

interface TableOfContentsProps {
  headings: HeadingData[];
  menuItemDidTap: () => void;
  isOpen: boolean;
}

// TODO: Implement full TableOfContents functionality
const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  headings, 
  menuItemDidTap, 
  isOpen 
}) => {
  const tocClassNames = [styles.tableOfContents];

  if (isOpen) {
    tocClassNames.push(styles.open);
  }

  return (
    <div className={tocClassNames.join(' ')}>
      {/* Placeholder for table of contents */}
      <nav>
        {headings.map((heading, index) => (
          <div key={index} onClick={menuItemDidTap}>
            {heading.value}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;