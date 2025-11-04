import React from 'react';

import Main from '../components/Main';
import styles from './404.module.scss';

class NotFoundPage extends React.Component {
  render() {
    const contents = (
      <div className={styles.errorInfoWrapper}>
        <div className={styles.errorInfo}>
          <div className={styles.title}>404 Not Found</div>
          <div className={styles.description}>
            What you are looking for is not in this universe.
          </div>
        </div>
      </div>
    );

    return <Main sections={contents} layout={'Error'} />;
  }
}

export default NotFoundPage;
