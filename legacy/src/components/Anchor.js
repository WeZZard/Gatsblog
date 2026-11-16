import React from 'react';
import PropTypes from 'prop-types';
import styles from './Anchor.module.scss';

import { Link } from 'gatsby';

const Anchor = props => {
  const { href, className } = props;
  const newProps = { ...props };
  delete newProps.href;
  delete newProps.className;

  const classNames = [className, styles.link].filter(_ => _).join(' ');

  if (href.startsWith('/') && !href.startsWith('/static/')) {
    return <Link className={classNames} to={href} {...newProps} />;
  } else {
    return <a className={classNames} href={href} {...newProps} />;
  }
};

Anchor.displayName = 'Anchor';

Anchor.propTypes = {
  href: PropTypes.string,
  className: PropTypes.string,
};

export default Anchor;
