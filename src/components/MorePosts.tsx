import React from 'react';
import { Post } from '../types';

interface MorePostsProps {
  earlierPostExcerpt?: Post;
  laterPostExcerpt?: Post;
}

const MorePosts: React.FC<MorePostsProps> = ({ earlierPostExcerpt, laterPostExcerpt }) => {
  return (
    <div className="more-posts">
      <h3>Related Posts</h3>
      {earlierPostExcerpt && (
        <div className="earlier-post">
          <h4>Earlier: {earlierPostExcerpt.title}</h4>
          <p>{earlierPostExcerpt.file.childMdx.excerpt}</p>
        </div>
      )}
      {laterPostExcerpt && (
        <div className="later-post">
          <h4>Later: {laterPostExcerpt.title}</h4>
          <p>{laterPostExcerpt.file.childMdx.excerpt}</p>
        </div>
      )}
    </div>
  );
};

export default MorePosts;