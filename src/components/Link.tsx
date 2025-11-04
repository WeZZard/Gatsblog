import React from 'react';
import * as styles from './Link.module.scss';
import { Link as GatsbyLink } from 'gatsby';

interface LinkProps {
  kind: string;
  to: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ 
  kind, 
  to, 
  className = '', 
  onClick, 
  children,
  ...others 
}) => {
  const linkClassName = [styles[kind], className].filter(cls => cls).join(' ');

  if (to.startsWith('/') && !to.endsWith('.xml')) {
    return (
      <GatsbyLink 
        className={linkClassName} 
        to={to} 
        onClick={onClick} 
        {...others}
      >
        {children}
      </GatsbyLink>
    );
  } else {
    return (
      <a 
        className={linkClassName} 
        href={to} 
        onClick={onClick} 
        {...others}
      >
        {children}
      </a>
    );
  }
};

export default Link;