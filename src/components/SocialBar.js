import React from 'react';
import PropTypes from 'prop-types';
import styles from './SocialBar.module.scss';

import Link from './Link';
import { graphql, StaticQuery } from 'gatsby';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const iconProtocols = {
  fontawesome: 'fontawesome://',
};

const Icon = ({ icon }) => {
  if (icon.startsWith(iconProtocols.fontawesome)) {
    const resources = icon
      .substring(iconProtocols.fontawesome.length)
      .split('/');
    return <FontAwesomeIcon size={'2x'} icon={resources} />;
  }
  throw `Unexpected icon resource: ${icon}`;
};

const SocialBar = ({ isOpen, menuItemDidTap }) => (
  <StaticQuery
    query={componentQuery}
    render={({ config: { social: socialItems } }) => {
      const wrapperClassNames = [styles.social];

      if (isOpen) {
        wrapperClassNames.push(styles.open);
      }

      const wrapperClassName = wrapperClassNames.join(' ');

      return (
        <div className={wrapperClassName}>
          {socialItems.map(item => (
            <div key={item.name} className={styles.item}>
              <Link kind={'social'} to={item.link} onClick={menuItemDidTap}>
                <div className={styles.icon}>
                  <Icon icon={item.icon} />
                </div>
                <span className={styles.title}>{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
      );
    }}
  />
);

SocialBar.displayName = 'SocialBar';

SocialBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  menuItemDidTap: PropTypes.func.isRequired,
};

export default SocialBar;

const componentQuery = graphql`
  query SocialQuery {
    config {
      social {
        name
        icon
        link
      }
    }
  }
`;
