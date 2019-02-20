import React from 'react';
import styles from './Link.module.scss';

export default props => {
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
