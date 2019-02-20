import React from 'react';
import PropTypes from 'prop-types';
import styles from './Link.module.scss';

const Link = props => {
  const { kind, to: href, className } = props;

  const newProps = { ...props };
  delete newProps.kind;
  delete newProps.to;
  delete newProps.className;

  return (
    <a
      className={[styles[kind], className].join(' ')}
      href={href}
      {...newProps}
    />
  );
};

Link.propTypes = {
  kind: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
};

export default Link;
