import { StaticQuery } from 'gatsby';
import themes from '../styles/themes/themes.scss';

export default (object) => {
    return <StaticQuery
        query={graphql`
            {
                configYaml {
                    site {
                        theme
                    }
                }
            }
        `}

        render={
            data => {
                const {
                    configYaml: {
                        site: {
                            theme
                        }
                    }
                } = data;

                const themeStyle = `theme-${theme}`;

                if (Array.isArray(object)) {
                    return [...object, themeStyle]
                }

                if (typeof object === 'string') {
                    return [object, themeStyle]
                }

                throw `Unexpected style object: ${object}. It shall be a string or an array of string`;
            }
        }
    />
};
