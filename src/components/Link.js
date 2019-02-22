import React from 'react';
import PropTypes from 'prop-types';
import styles from './Link.module.scss';

import { Link as _Link } from 'gatsby';

const { decrypt } = require('../../core/utils');

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const { to } = this.props;

    const protectedPrefix = 'protected://';

    if (to.startsWith(protectedPrefix)) {
      const protectedUrl = to.slice(protectedPrefix.length);

      const originalUrl = decrypt(protectedUrl);

      const components = originalUrl.split('').reverse();

      this.state = { isProtected: true, components };
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
      ...others
    } = this.props;

    const { isProtected } = this.state;

    if (isProtected) {
      return this.renderProtectedLink({
        kind,
        className,
        props: others,
        obfuscatedHref,
      });
    }

    return Link.renderLink({ kind, className, to, onClick, props: others });
  }

  getProtectedUrl() {
    const { components } = this.state;
    if (components) {
      return `${components.reverse().join('')}`;
    } else {
      return undefined;
    }
  }

  static renderLink({ kind, className, to, onClick, props }) {
    const linkClassName = [styles[kind], className].filter(_ => _).join(' ');

    if (to.startsWith('/')) {
      return (
        <_Link className={linkClassName} to={to} onClick={onClick} {...props} />
      );
    } else {
      return (
        <a className={linkClassName} href={to} onClick={onClick} {...props} />
      );
    }
  }

  renderProtectedLink({ kind, className, props, obfuscatedHref }) {
    const linkClassName = [styles[kind], className].filter(_ => _).join(' ');

    return (
      <a
        className={linkClassName}
        onClick={this.handleClick}
        href={obfuscatedHref}
        {...props}
      />
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
