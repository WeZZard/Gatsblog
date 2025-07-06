import React from 'react';
import PropTypes from 'prop-types';
import styles from './Link.module.scss';

import { Link as _Link } from 'gatsby';

// Nuclear approach: Always render simple links to completely avoid circular reference issues
const Link = (props) => {
  // Extract basic props safely
  let to = '#';
  let className = '';
  let children = '';
  let onClick = null;
  
  try {
    if (props && props.to) to = props.to;
    if (props && props.className) className = props.className;
    if (props && props.children) children = props.children;
    if (props && props.onClick) onClick = props.onClick;
  } catch (e) {
    // Ignore any property access errors
  }
  
  // Always render as simple <a> tag - no client-side/SSR distinction
  return React.createElement('a', { 
    href: to, 
    className, 
    onClick 
  }, children);
};

// Removed client-side component to avoid all complexity

Link.propTypes = {
  kind: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  obfuscatedHref: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

Link.defaultProps = {
  obfuscatedHref: 'https://yo-mama-wears-a-pair-of-fancy-glasses',
};

export default Link;
