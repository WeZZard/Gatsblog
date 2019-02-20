import React from 'react';
import PropTypes from 'prop-types';
import styles from './Link.module.scss';

import { Link as _Link } from 'gatsby';

const Link = props => {
  const { kind, to, className } = props;

  const newProps = { ...props };
  delete newProps.kind;
  delete newProps.className;

  if (to.startsWith('/')) {
    return (
      <_Link className={[styles[kind], className].join(' ')} {...newProps} />
    );
  } else {
    delete newProps.to;

    return (
      <a
        className={[styles[kind], className].join(' ')}
        href={to}
        {...newProps}
      />
    );
  }
};

Link.propTypes = {
  kind: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
};

export default Link;
