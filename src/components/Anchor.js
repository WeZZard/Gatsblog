import React from 'react';
import PropTypes from 'prop-types';
import styles from './Anchor.module.scss';

import { Link } from 'gatsby';

const Anchor = props => {
  const { href } = props;
  const newProps = { ...props };
  delete newProps.href;
  if (href.startsWith('/')) {
    return <Link className={styles.link} to={href} {...newProps} />;
  } else {
    return <a className={styles.link} href={href} {...newProps} />;
  }
};

Anchor.displayName = 'Anchor';

Anchor.propTypes = {
  href: PropTypes.string,
};

export default Anchor;
