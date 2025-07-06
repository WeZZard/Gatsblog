import React from 'react';
import PropTypes from 'prop-types';
import styles from './SiteTitle.module.scss';

const SiteTitle = ({ title }) => {
  // Defensive check to avoid circular reference issues with CSS modules during SSR
  const safeStyles = styles || {};
  
  return (
    <label className={safeStyles.siteTitle || 'site-title'}>{title}</label>
  );
};

SiteTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SiteTitle;
