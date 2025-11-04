import React from 'react';
import PropTypes from 'prop-types';
import styles from './Taxonomy.module.scss';

import Link from './Link';

const Taxonomy = ({ kind, name, className, taxonomies }) => {
  const taxonomyItems = taxonomies.map(taxonomy => (
    <li key={`${taxonomy.slug}`} className={styles.taxonomyItem}>
      <span>
        <Link to={taxonomy.slug} kind={kind}>
          {taxonomy.name}
        </Link>
      </span>
    </li>
  ));

  return (
    <div className={[styles.taxonomy, className].join(' ')}>
      <div className={styles.taxonomyName}>
        <label>{name}</label>
      </div>
      <ul className={styles.taxonomyItemList}>{taxonomyItems}</ul>
    </div>
  );
};

export default Taxonomy;

Taxonomy.propTypes = {
  className: PropTypes.string,
  kind: PropTypes.string,
  name: PropTypes.string,
  taxonomies: PropTypes.arrayOf(PropTypes.object),
};
