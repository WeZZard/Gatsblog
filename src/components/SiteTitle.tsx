import React from 'react';
import * as styles from './SiteTitle.module.scss';

interface SiteTitleProps {
  title: string;
}

const SiteTitle: React.FC<SiteTitleProps> = ({ title }) => (
  <label className={styles.siteTitle}>{title}</label>
);

export default SiteTitle;