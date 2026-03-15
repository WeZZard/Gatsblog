import React from 'react';

import Main from '../components/Main';

class NotFoundPage extends React.Component {
  render() {
    const contents = (
      <div>
        <div>
          <div>404 Not Found</div>
          <div>
            What you are looking for is not in this universe.
          </div>
        </div>
      </div>
    );

    return <Main sections={contents} layout={'Error'} />;
  }
}

export default NotFoundPage;
