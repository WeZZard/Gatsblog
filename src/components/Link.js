import React from 'react';
import PropTypes from 'prop-types';
import styles from './Link.module.scss';

import { Link as _Link } from 'gatsby';

// Simple functional component for SSR to avoid circular reference issues
const Link = (props) => {
  // During SSR, render simple links without any complex processing
  if (typeof window === 'undefined') {
    // Use absolutely minimal approach - avoid any prop access that could trigger circular refs
    try {
      const to = props && props.to ? props.to : '#';
      const className = props && props.className ? props.className : '';
      const children = props && props.children ? props.children : '';
      
      // Always render as simple <a> tag during SSR to avoid any complexity
      return React.createElement('a', { className, href: to }, children);
    } catch (e) {
      // If even this fails, return minimal fallback
      return React.createElement('a', { href: '#' }, '');
    }
  }

  // For client-side rendering, use the full component with protection logic
  const { to, kind, className, obfuscatedHref, onClick, children, ...others } = props;
  return <LinkClientSide to={to} kind={kind} className={className} obfuscatedHref={obfuscatedHref} onClick={onClick} {...others}>{children}</LinkClientSide>;
};

// Client-side component with full functionality
class LinkClientSide extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const { to } = this.props;

    // Safety check for undefined or null 'to' prop
    if (!to || typeof to !== 'string') {
      this.state = { isProtected: false };
      return;
    }

    const protectedPrefix = 'protected://';

    if (to.startsWith(protectedPrefix)) {
      const protectedUrl = to.slice(protectedPrefix.length);

      try {
        // Import decrypt during client-side rendering
        const { decrypt } = require('../../core/utils');
        const originalUrl = decrypt(protectedUrl);

        const components = originalUrl.split('').reverse();

        this.state = { isProtected: true, components };
      } catch (error) {
        // If decryption fails, treat as non-protected link
        console.warn('Failed to decrypt protected URL:', error);
        this.state = { isProtected: false };
      }
    } else if (to.startsWith('toprotect://')) {
      throw `Trying to created a link with to-protect contents (link starts with toprotect://), which is expected to be converted into protected contents by the framework.`;
    } else {
      this.state = { isProtected: false };
    }
  }

  render() {
    const {
      to,
      kind,
      className,
      obfuscatedHref,
      onClick,
      children,
      ...others
    } = this.props;

    const { isProtected } = this.state;

    if (isProtected) {
      return this.renderProtectedLink({
        kind,
        className,
        props: others,
        obfuscatedHref,
        children,
      });
    }

    return this.renderLink({ kind, className, to, onClick, props: others, children });
  }

  getProtectedUrl() {
    const { components } = this.state;
    if (components) {
      return `${components.reverse().join('')}`;
    } else {
      return undefined;
    }
  }

  renderLink({ kind, className, to, onClick, props, children }) {
    const linkClassName = [styles[kind], className].filter(_ => _).join(' ');

    if (to.startsWith('/') && !to.endsWith('.xml')) {
      return (
        <_Link className={linkClassName} to={to} onClick={onClick} {...props}>
          {children}
        </_Link>
      );
    } else {
      return (
        <a className={linkClassName} href={to} onClick={onClick} {...props}>
          {children}
        </a>
      );
    }
  }

  renderProtectedLink({ kind, className, props, obfuscatedHref, children }) {
    const linkClassName = [styles[kind], className].filter(_ => _).join(' ');

    return (
      <a
        className={linkClassName}
        onClick={this.handleClick}
        href={obfuscatedHref}
        {...props}
      >
        {children}
      </a>
    );
  }

  handleClick(event) {
    const { onClick } = this.props;
    onClick();
    event.preventDefault();
    window.location.href = this.getProtectedUrl();
  }
}

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
