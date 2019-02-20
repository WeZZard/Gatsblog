import React from 'react';
import PropTypes from 'prop-types';
import styles from './Title.module.scss';

class Title extends React.Component {
  render() {
    const { textStyle = 'sans', title, subtitle } = this.props;

    const subtitleComponent = subtitle ? (
      <div className={styles.subtitle}>
        <h2 className={styles[textStyle]}>{subtitle}</h2>
      </div>
    ) : null;

    return (
      <React.Fragment>
        <div className={styles.title}>
          <h1 className={styles[textStyle]}>{title}</h1>
        </div>
        {subtitleComponent}
      </React.Fragment>
    );
  }
}

Title.propTypes = {
  textStyle: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default Title;
