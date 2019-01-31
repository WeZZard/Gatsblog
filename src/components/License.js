import React from "react"
import styles from './License.module.scss'
import CC40_BY from './CC40_BY'
import CC40_BY_NC from './CC40_BY_NC'
import CC40_BY_NC_ND from './CC40_BY_NC_ND'
import CC40_BY_NC_SA from './CC40_BY_NC_SA'
import CC40_BY_ND from './CC40_BY_ND'
import CC40_BY_SA from './CC40_BY_SA'

class License extends React.Component {
    render() {
        const { license } = this.props;

        let IMG;

        switch (license) {
            case 'cc4.0-by':
                IMG = CC40_BY;
                break;
            case 'cc4.0-by-nc':
                IMG = CC40_BY_NC;
                break;
            case 'cc4.0-by-nc-nd':
                IMG = CC40_BY_NC_ND;
                break;
            case 'cc4.0-by-nc-sa':
                IMG = CC40_BY_NC_SA;
                break;
            case 'cc4.0-by-nd':
                IMG = CC40_BY_ND;
                break;
            case 'cc4.0-by-sa':
                IMG = CC40_BY_SA;
                break;
            default:
                IMG = undefined;
                break;
        }

        const imageComponent = IMG
            ? <span className={styles.licenseImage}><IMG/></span>
            : undefined;

        return <div className={styles.licenseContainer}>
            {imageComponent}
            <span className={styles.licenseText}>This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.</span>
        </div>
    }
}

export default License
