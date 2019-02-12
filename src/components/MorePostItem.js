import React from "react"
import styles from './MorePostItem.module.scss'
import PostExcerpt from './PostExcerpt';

class MorePostItem extends React.Component {
    render() {
        const { info } = this.props;

        const { title, item } = info;

        return <div className={styles.morePostItem}>
            <div className={styles.caption}>
                <span>{title}</span>
            </div>
            <PostExcerpt item={item}/>
        </div>
    }
}

export default MorePostItem
