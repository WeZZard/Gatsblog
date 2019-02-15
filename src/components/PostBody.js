import React from 'react'
import Renderer from "./Renderer";
import styles from './PostBody.module.scss'

class PostBody extends React.Component {
    render() {
        const { post } = this.props;
        const {
            file: {
                childMdx: {
                    code,
                },
            },
        } = post;

        return <React.Fragment>
            <section className={styles.content}>
                <Renderer textStyle={'serif'}>{code.body}</Renderer>
            </section>
        </React.Fragment>
    }
}

export default PostBody
