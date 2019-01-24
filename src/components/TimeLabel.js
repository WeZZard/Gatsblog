import React from 'react'
import styles from './TimeLabel.module.scss'

class TimeLabel extends React.Component {
    render() {
        const {
            dateTime: primitiveDateTime,
            locale = `enUS`,
            localizedFormatOption = { year: 'numeric', month: 'short', day: 'numeric' }
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
        const localizedDateTime = dateTime.toLocaleDateString(locale, localizedFormatOption);

        return <time className={styles.time} dateTime={isoDateTime}>{localizedDateTime}</time>;
    }
}

export default TimeLabel
