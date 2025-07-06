import React from 'react';
import PropTypes from 'prop-types';
import assert from 'assert';
import styles from './MorePosts.module.scss';

import MorePostItem from './MorePostItem';

class MorePosts extends React.Component {
  render() {
    const { earlierPostExcerpt, laterPostExcerpt } = this.props;

    assert(earlierPostExcerpt || laterPostExcerpt);

    const morePostInfo = [
      { item: laterPostExcerpt, title: 'Later Post' },
      { item: earlierPostExcerpt, title: 'Earlier Post' },
    ].filter(_ => _.item);

    const components = morePostInfo.map(info => (
      <div key={info.title} className={styles.morePostItem}>
        <MorePostItem info={info} />
      </div>
    ));

    return (
      <React.Fragment>
        <div className={styles.morePosts}>{components}</div>
      </React.Fragment>
    );
  }
}

MorePosts.propTypes = {
  earlierPostExcerpt: PropTypes.object,
  laterPostExcerpt: PropTypes.object,
};

export default MorePosts;
