import React from "react"
import styles from './License.module.scss'
import CC40Image from './CC40Image'

class License extends React.Component {
    render() {
        const { license } = this.props;

        const cc40Regex = /^cc4\.0-((by)|(by-nc)|(by-nc-nd)|(by-nc-sa)|(by-nd)|(by-sa))$/i;

        const cc40Match = cc40Regex.exec(license);

        if (cc40Match) {
            const optionString = cc40Match[1].toLowerCase();

            const options = optionString.split('-');

            const text = License.cc40TextForOptions(options);

            return <div className={styles.license}>
                <span className={styles.image}>
                    <CC40Image options={optionString}/>
                </span>
                <span className={styles.text}>{text}</span>
            </div>
        } else {
            return <div className={styles.license}>
                <span className={styles.text}>{license}</span>
            </div>
        }
    }

    static cc40TextForOptions(options) {
        const items = [];

        if (options.includes('by')) {
            items.push('Attribution')
        }

        if (options.includes('nc')) {
            items.push('NonCommercial')
        }

        if (options.includes('nd')) {
            items.push('NonDerivatives')
        }

        if (options.includes('sa')) {
            items.push('ShareAlike')
        }

        return `This work is licensed under a Creative Commons ${items.join('-')} 4.0 International License.`
    };

}

export default License
