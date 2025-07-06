import React from 'react';
import { Post } from '../types';

interface PostExcerptProps {
  item: Post;
}

const PostExcerpt: React.FC<PostExcerptProps> = ({ item }) => {
  return (
    <article className="post-excerpt">
      <header>
        <h2>{item.title}</h2>
        {item.subtitle && <h3>{item.subtitle}</h3>}
        <div className="post-meta">
          <time dateTime={item.createdTime}>{item.createdTime}</time>
          <span className="category">{item.category}</span>
        </div>
      </header>
      <div className="excerpt">
        {item.file.childMdx.excerpt}
      </div>
      <div className="tags">
        {item.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export default PostExcerpt;