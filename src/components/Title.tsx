import React from 'react';
import * as styles from './Title.module.scss';

interface TitleProps {
  title: string;
  subtitle?: string;
  textStyle?: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle, textStyle }) => {
  const titleClass = textStyle ? styles[textStyle] : styles.title;
  
  return (
    <div className={styles.titleContainer}>
      <h1 className={titleClass}>{title}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
    </div>
  );
};

export default Title;