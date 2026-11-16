import React from 'react';
import PropTypes from 'prop-types';
import styles from './SiteTitle.module.scss';

const SiteTitle = ({ title }) => (
  <label className={styles.siteTitle}>{title}</label>
);

SiteTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SiteTitle;
