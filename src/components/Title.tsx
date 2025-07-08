import React from 'react';
import * as styles from './Title.module.scss';

interface TitleProps {
  title: string;
  subtitle?: string;
  textStyle?: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle, textStyle = 'sans' }) => {
  const subtitleComponent = subtitle ? (
    <div className={styles.subtitle}>
      <h2 className={styles[textStyle]}>{subtitle}</h2>
    </div>
  ) : null;

  return (
    <>
      <div className={styles.title}>
        <h1 className={styles[textStyle]}>{title}</h1>
      </div>
      {subtitleComponent}
    </>
  );
};

export default Title;