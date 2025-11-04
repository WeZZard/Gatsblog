import React from 'react';
import PropTypes from 'prop-types';
import styles from './TimeLabel.module.scss';

class TimeLabel extends React.Component {
  render() {
    const {
      dateTime: primitiveDateTime,
      locale = `en-US`,
      localizedFormatOption = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    } = this.props;

    let dateTime;

    if (typeof primitiveDateTime === 'string') {
      dateTime = new Date(primitiveDateTime);
    } else if (primitiveDateTime instanceof Date) {
      dateTime = primitiveDateTime;
    } else {
      throw `Invalid dateTime: ${primitiveDateTime}`;
    }

    const isoDateTime = dateTime.toISOString();
    const localizedDateTime = dateTime.toLocaleDateString(
      locale,
      localizedFormatOption,
    );

    return (
      <time className={styles.time} dateTime={isoDateTime}>
        {localizedDateTime}
      </time>
    );
  }
}

export default TimeLabel;

TimeLabel.propTypes = {
  dateTime: PropTypes.string.isRequired,
  locale: PropTypes.string,
  localizedFormatOption: PropTypes.object,
};
