import React from 'react'
import styles from './TimeLabel.module.scss'

class TimeLabel extends React.Component {
    render() {
        const {
            dateTime,
            dateTimeString,
            locale = `enUS`,
            localizedFormatOption = { year: 'numeric', month: 'short', day: 'numeric' }
        } = this.props;

        let guardedDateTime;

        if (dateTime) {
            guardedDateTime = dateTime;
        } else {
            guardedDateTime = new Date(dateTimeString);
        }

        const isoDateTime = guardedDateTime.toISOString();
        const localizedDateTime = guardedDateTime.toLocaleDateString(locale, localizedFormatOption);

        return <time className={styles.time} dateTime={isoDateTime}>{localizedDateTime}</time>;
    }
}

export default TimeLabel
