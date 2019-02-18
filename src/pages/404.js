import React from 'react';
import { graphql } from 'gatsby';

// import SEO from '../components/SEO';

class NotFoundPage extends React.Component {
    render() {
        const { data } = this.props;
        const {
            config : {
                site: { siteTitle },
            },
        } = data;

        // <SEO title="404: Not Found" />
        return (
            <div>

                <h1>Not Found</h1>
                <p>
                    You just hit a route that doesn&#39;t exist... the sadness.
                </p>
            </div>
        );
    }
}

export default NotFoundPage;

export const pageQuery = graphql`
    query {
        config: configYaml {
            site {
                title
            }
        }
    }
`;
