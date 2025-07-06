import React from 'react';

interface PostFooterProps {
  tags?: string[];
  license?: string;
}

const PostFooter: React.FC<PostFooterProps> = ({ tags, license }) => {
  return (
    <div className="post-footer">
      {tags && tags.length > 0 && (
        <div className="tags">
          <span className="tags-label">Tags: </span>
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              {index < tags.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
      {license && (
        <div className="license">
          <span className="license-label">License: </span>
          <span className="license-value">{license}</span>
        </div>
      )}
    </div>
  );
};

export default PostFooter;