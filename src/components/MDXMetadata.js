import React from 'react';
import PropTypes from 'prop-types';
import styles from './MDXMetadata.module.scss';

import TimeLabel from './TimeLabel';
import CategoryLabel from './CategoryLabel';
import TagsLabel from './TagsLabel';

const MDXMetadata = ({ items }) => {
  const components = items
    .map(item => {
      const { name, data } = item;
      switch (name) {
        case 'time':
          return <TimeLabel key={'time'} dateTime={data} />;
        case 'category':
          return <CategoryLabel key={'category'} category={data} />;
        case 'tags':
          return <TagsLabel key={'tags'} tags={data} />;
        default:
          throw `Unexpected item name: ${name}`;
      }
    })
    .map((item, index) => {
      return (
        <div key={index} className={styles.item}>
          {item}
        </div>
      );
    });

  return <div className={styles.flexWrapper}>{components}</div>;
};

MDXMetadata.propTypes = {
  items: PropTypes.object.isRequired,
};

export default MDXMetadata;
