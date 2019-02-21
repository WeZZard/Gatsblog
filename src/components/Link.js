import React from 'react';
import PropTypes from 'prop-types';
import styles from './Link.module.scss';

import { Link as _Link } from 'gatsby';

const protectedProtocols = {
  mailto: 'mailto:',
  tel: 'tel:',
  sms: 'sms:',
  facetime: 'facetime:',
};

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const { to } = this.props;

    let protectedProtocol;

    for (const [protocolName, protocol] of Object.entries(protectedProtocols)) {
      if (to.startsWith(protocol)) {
        protectedProtocol = { protocolName, protocol };
      }
    }

    if (protectedProtocol) {
      const { protocol } = protectedProtocol;
      const url = to.substring(protocol.length);
      const urlComponents = url.split('').reverse();

      this.state = {
        isProtected: true,
        protocol,
        urlComponents,
      };
    } else {
      this.state = {
        isProtected: false,
      };
    }
  }

  render() {
    const {
      to,
      kind,
      className,
      obfuscateIfNeeded,
      obfuscatedHref,
      onClick,
      ...others
    } = this.props;

    const { isProtected } = this.state;

    if (isProtected) {
      if (obfuscateIfNeeded) {
        return this.renderProtectedLink({
          kind,
          className,
          props: others,
          obfuscatedHref,
        });
      }
    }

    return Link.renderLink({ kind, className, to, onClick, props: others });
  }

  getProtectedUrl() {
    const { protocol, urlComponents } = this.state;
    if (protocol && urlComponents) {
      const link = `${protocol}${urlComponents.reverse().join('')}`;
      return link;
    } else {
      return undefined;
    }
  }

  static renderLink({ kind, className, to, onClick, props }) {
    const linkClassName = [styles[kind], className].filter(_ => _).join(' ');

    if (to.startsWith('/')) {
      return <_Link className={linkClassName} to={to} onClick={onClick} {...props} />;
    } else {
      return <a className={linkClassName} href={to} onClick={onClick} {...props} />;
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
  obfuscateIfNeeded: PropTypes.bool,
  obfuscatedHref: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

Link.defaultProps = {
  obfuscateIfNeeded: true,
  obfuscatedHref: '',
};

export default Link;
