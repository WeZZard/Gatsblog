import React, { useState, useCallback } from 'react';
import * as styles from './Main.module.scss';

import { MainProps, MdxHeading } from '../types';
import Viewport from './Viewport';
import SEO from './SEO';
import GoogleAnalytics from './GoogleAnalytics';
import AppBackground from './AppBackground';
import Navigation from './Navigation';
import Contents from './Contents';
import SiteFooter from './SiteFooter';

const Main: React.FC<MainProps> = ({
  slug,
  lang,
  title,
  description,
  keywords,
  headings,
  sections,
  layout = 'Content',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuDidToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const menuDidClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navigationClassNames = [styles.navigation];
  const appBackgroundClassNames = [styles.appBackground];
  const contentsClassNames = [styles.contents];
  const footerClassNames = [styles.footer];

  if (isMenuOpen) {
    navigationClassNames.push(styles.menuOpen);
  }

  let contents: React.ReactNode;
  let backgroundPosition: string;

  switch (layout) {
    case 'Content':
      contents = <Contents sections={sections} />;
      backgroundPosition = 'Left';
      break;
    case 'Error':
      contents = sections;
      navigationClassNames.push(styles.error);
      appBackgroundClassNames.push(styles.error);
      contentsClassNames.push(styles.error);
      footerClassNames.push(styles.error);
      backgroundPosition = 'Center';
      break;
    default:
      throw new Error(`Unexpected layout: ${layout}.`);
  }

  const navigationClassName = navigationClassNames.join(' ');
  const appBackgroundClassName = appBackgroundClassNames.join(' ');
  const contentsClassName = contentsClassNames.join(' ');
  const footerClassName = footerClassNames.join(' ');

  return (
    <>
      <Viewport />
      <GoogleAnalytics />
      <SEO
        lang={lang}
        title={title}
        description={description}
        keywords={keywords}
      />
      <div className={styles.main}>
        <div className={appBackgroundClassName}>
          <AppBackground backgroundPosition={backgroundPosition} />
        </div>
        <div className={navigationClassName}>
          <Navigation
            slug={slug}
            headings={headings}
            delegate={{
              menuDidToggle,
              menuDidClose,
            }}
          />
        </div>
        <div className={contentsClassName}>{contents}</div>
        <div className={footerClassName}>
          <div className={styles.footerContents}>
            <SiteFooter />
            <div className={styles.footerOverlay} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;